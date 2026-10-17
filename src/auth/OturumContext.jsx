// OturumContext.jsx - Giriş yapan kullanıcının bilgisini TÜM uygulamaya dağıtır.
//
// Context nedir? Bir bilgiyi (ör. "kim giriş yaptı") her bileşene tek tek
// parametre olarak geçmek yerine, uygulamanın tamamına yayınlamanın React yolu.
// Herhangi bir bileşen  useOturum()  diyerek bu bilgiye ulaşır.
//
// OTURUM YÖNETİMİ:
//   - Giriş -> backend token verir -> localStorage'a yazılır
//   - Sayfa yenilenince -> token varsa /auth/ben ile kullanıcı tekrar alınır
//   - Token süresi dolunca -> otomatik çıkış (zamanlayıcı)
//   - Backend 401 dönerse -> otomatik çıkış ("oturum-bitti" olayı)
//   - Çıkış -> backend'e haber verilir (eski token geçersiz olur) + token silinir

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import * as api from "../api/client.js";

const OturumContext = createContext(null);

/** JWT'nin orta kısmını (içerik) okur. SADECE süreyi göstermek için; doğrulamayı backend yapar. */
function tokenIcerigi(token) {
  try {
    // JWT: başlık.İÇERİK.imza -> içerik base64url ile kodlanmıştır
    const parca = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(parca));
  } catch {
    return null;
  }
}

export function OturumSaglayici({ children }) {
  const [kullanici, setKullanici] = useState(null); // giriş yapan kişi (yoksa null)
  const [yukleniyor, setYukleniyor] = useState(true); // açılışta token kontrol ediliyor mu?
  const [bitisZamani, setBitisZamani] = useState(null); // token'ın son geçerlilik anı (ms)
  const [bilgiMesaji, setBilgiMesaji] = useState(""); // ör. "Oturum süresi doldu"

  // Token'ı ve kullanıcıyı tarayıcıdan temizler (sunucuya gitmeden)
  const yerelCikis = useCallback((mesaj = "") => {
    localStorage.removeItem(api.TOKEN_ANAHTARI);
    setKullanici(null);
    setBitisZamani(null);
    setBilgiMesaji(mesaj);
  }, []);

  // 1) Açılışta: kayıtlı token varsa backend'e "bu kim?" diye sor
  useEffect(() => {
    const token = localStorage.getItem(api.TOKEN_ANAHTARI);
    if (!token) {
      setYukleniyor(false);
      return;
    }
    const icerik = tokenIcerigi(token);
    api
      .benKimim()
      .then((veri) => {
        setKullanici(veri.kullanici);
        if (icerik?.exp) setBitisZamani(icerik.exp * 1000); // exp saniye cinsinden
      })
      .catch(() => yerelCikis()) // token geçersizse sessizce temizle
      .finally(() => setYukleniyor(false));
  }, [yerelCikis]);

  // 2) Backend 401 dönerse (client.js bu olayı yayınlar) -> otomatik çıkış
  useEffect(() => {
    const dinleyici = (olay) => yerelCikis(olay.detail || "Oturumunuz sona erdi.");
    window.addEventListener("oturum-bitti", dinleyici);
    // return içindeki fonksiyon, bileşen kaldırılınca dinleyiciyi temizler
    return () => window.removeEventListener("oturum-bitti", dinleyici);
  }, [yerelCikis]);

  // 3) Token süresi dolduğu anda otomatik çıkış (zamanlayıcı)
  useEffect(() => {
    if (!bitisZamani) return;
    const kalan = bitisZamani - Date.now();
    const zamanlayici = setTimeout(
      () => yerelCikis("Oturum süresi doldu. Lütfen tekrar giriş yapın."),
      Math.max(kalan, 0)
    );
    return () => clearTimeout(zamanlayici);
  }, [bitisZamani, yerelCikis]);

  /** Giriş: backend'den token al, sakla, kullanıcıyı ayarla. Hata olursa çağırana fırlatır. */
  async function giris(email, parola) {
    const veri = await api.girisYap(email, parola);
    localStorage.setItem(api.TOKEN_ANAHTARI, veri.token);
    setKullanici(veri.kullanici);
    setBitisZamani(Date.now() + veri.sure_dakika * 60 * 1000);
    setBilgiMesaji("");
    return veri.kullanici;
  }

  /** Çıkış: önce backend'e haber ver (token'ı sunucuda geçersiz kılar), sonra yerelde temizle. */
  async function cikis() {
    try {
      await api.cikisYap();
    } finally {
      yerelCikis("Çıkış yapıldı.");
    }
  }

  const deger = { kullanici, yukleniyor, bitisZamani, bilgiMesaji, setBilgiMesaji, giris, cikis };
  return <OturumContext.Provider value={deger}>{children}</OturumContext.Provider>;
}

/** Bileşenlerin oturum bilgisine ulaşması için kısayol: const { kullanici } = useOturum(); */
export function useOturum() {
  return useContext(OturumContext);
}
