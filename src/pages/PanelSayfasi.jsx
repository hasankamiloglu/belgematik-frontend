// PanelSayfasi.jsx - Giriş yapmış HER kullanıcının gördüğü kişisel panel.
// App.jsx'te <KorumaliSayfa> ile sarıldığı için giriş yapmayan buraya giremez.

import { useOturum } from "../auth/OturumContext.jsx";

export default function PanelSayfasi() {
  const { kullanici } = useOturum();

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
      <p className="muted">
        Belge yükleme ekranı sonraki haftalarda bu panele eklenecek.
      </p>
    </section>
  );
}
