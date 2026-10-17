// YoneticiSayfasi.jsx - SADECE yöneticinin gördüğü sayfa.
// Veriler GET /api/yonetici/kullanicilar adresinden gelir; bu adres backend'de
// @yetki_gerekli("yonetici") ile korunur. Yönetici olmayan biri istek atarsa 403 alır.

import { useEffect, useState } from "react";
import { yoneticiOzeti } from "../api/client.js";

const tarih = (t) => (t ? new Date(t).toLocaleString("tr-TR") : "—");

export default function YoneticiSayfasi() {
  const [veri, setVeri] = useState(null);
  const [hata, setHata] = useState("");

  useEffect(() => {
    yoneticiOzeti()
      .then(setVeri)
      .catch((h) => setHata(`${h.durum}: ${h.message}`));
  }, []);

  if (hata) return <p className="error">{hata}</p>;
  if (!veri) return <p className="muted">Yükleniyor…</p>;

  return (
    <section>
      <h1>Yönetici paneli</h1>

      <h2>Kullanıcılar ({veri.kullanicilar.length})</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>#</th><th>Ad soyad</th><th>E-posta</th><th>Hesap türü</th><th>Yetki</th><th>Son giriş</th></tr>
          </thead>
          <tbody>
            {veri.kullanicilar.map((k) => (
              <tr key={k.id}>
                <td>{k.id}</td>
                <td>{k.ad_soyad}</td>
                <td>{k.email}</td>
                <td>{k.rol}</td>
                <td><span className={`badge ${k.yetki}`}>{k.yetki}</span></td>
                <td>{tarih(k.son_giris)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Son giriş denemeleri</h2>
      <p className="muted small">Başarısız denemeler de kaydedilir. Parola asla kaydedilmez.</p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Zaman</th><th>E-posta</th><th>Sonuç</th><th>IP</th></tr>
          </thead>
          <tbody>
            {veri.son_giris_denemeleri.map((d, i) => (
              <tr key={i}>
                <td>{tarih(d.tarih)}</td>
                <td>{d.email}</td>
                <td>{d.basarili ? <span className="ok-text">Başarılı</span> : <span className="err-text">Başarısız</span>}</td>
                <td>{d.ip_adresi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
