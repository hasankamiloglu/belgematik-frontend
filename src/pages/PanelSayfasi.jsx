// PanelSayfasi.jsx - Giriş yapmış HER kullanıcının gördüğü kişisel panel.
// App.jsx'te <KorumaliSayfa> ile sarıldığı için giriş yapmayan buraya giremez.

import { useEffect, useState } from "react";
import { benKimim } from "../api/client.js";
import { useOturum } from "../auth/OturumContext.jsx";

export default function PanelSayfasi() {
  const oturum = useOturum();
  // Hafta 8 hata düzeltmesi: Panel, girişte alınan ESKİ bilgiyi gösteriyordu
  // (belge yükleyince "Kalan kredi" azalmıyordu). Artık sayfa her açıldığında
  // güncel bilgi backend'den tekrar alınıyor; gelene kadar eski bilgi gösteriliyor.
  const [guncel, setGuncel] = useState(null);
  useEffect(() => {
    benKimim().then((v) => setGuncel(v.kullanici)).catch(() => {});
  }, []);
  const kullanici = guncel || oturum.kullanici;

  // Tarihi Türkçe biçimde göster: 17.10.2026 23:40
  const sonGiris = kullanici.son_giris
    ? new Date(kullanici.son_giris).toLocaleString("tr-TR")
    : "—";

  return (
    <section>
      <h1>Merhaba, {kullanici.ad_soyad}</h1>
      <div className="grid">
        <div className="card stat"><span>E-posta</span><b>{kullanici.email}</b></div>
        <div className="card stat"><span>Hesap türü</span><b>{kullanici.rol}</b></div>
        <div className="card stat"><span>Yetki</span><b>{kullanici.yetki}</b></div>
        <div className="card stat"><span>Paket</span><b>{kullanici.paket ?? "—"}</b></div>
        <div className="card stat"><span>Kalan kredi</span><b>{kullanici.kalan_kredi ?? "—"}</b></div>
        <div className="card stat"><span>Son giriş</span><b>{sonGiris}</b></div>
      </div>
      <a className="btn" href="#/belgeler">Belge yükle →</a>
    </section>
  );
}
