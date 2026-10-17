// KorumaliSayfa.jsx - Sayfayı sadece giriş yapmış (ve gerekirse yetkili) kişiye gösterir.
//
// Kullanım:
//   <KorumaliSayfa>                  -> giriş yapmış herkes
//   <KorumaliSayfa yetki="yonetici"> -> sadece yönetici
//
// DİKKAT: Bu kontrol sadece KULLANICI DENEYİMİ içindir (yanlış sayfayı göstermemek).
// Asıl güvenlik BACKEND'dedir: biri bu kodu atlatsa bile API 401/403 döner
// ve veri gelmez. "Yetkilendirmeyi yalnızca arayüzde yapmak" sık yapılan bir hatadır.

import { useEffect } from "react";
import { useOturum } from "../auth/OturumContext.jsx";
import { git } from "../hooks/useHashRota.js";

export default function KorumaliSayfa({ yetki, children }) {
  const { kullanici, yukleniyor, setBilgiMesaji } = useOturum();

  // Giriş yapılmamışsa -> giriş sayfasına yönlendir ve nedenini yaz
  useEffect(() => {
    if (!yukleniyor && !kullanici) {
      // önceki mesaj varsa (ör. "Oturum süresi doldu") onu koru, yoksa bunu yaz
      setBilgiMesaji((onceki) => onceki || "Bu sayfayı görmek için giriş yapmalısınız.");
      git("/giris");
    }
  }, [yukleniyor, kullanici, setBilgiMesaji]);

  if (yukleniyor) return <p className="muted">Oturum kontrol ediliyor…</p>;
  if (!kullanici) return null; // yönlendirme yapılıyor

  // Giriş yapılmış ama yetki yetmiyor -> 403 ekranı
  if (yetki && kullanici.yetki !== yetki) {
    return (
      <section className="card center">
        <div className="big-code">403</div>
        <h2>Erişim yetkiniz yok</h2>
        <p className="muted">
          Bu sayfa sadece <b>{yetki}</b> yetkisine sahip hesaplar içindir.
          Sizin yetkiniz: <b>{kullanici.yetki}</b>.
        </p>
        <a className="btn" href="#/panel">Panelime dön</a>
      </section>
    );
  }

  return children;
}
