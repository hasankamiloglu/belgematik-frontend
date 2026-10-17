// KayitSayfasi.jsx - Yeni hesap oluşturma formu.
//
// Parola kuralları burada da gösterilir (kullanıcı hemen görsün diye),
// ama ASIL kontrol backend'de yapılır (app/services/auth/parola.py).

import { useState } from "react";
import { kayitOl } from "../api/client.js";
import { useOturum } from "../auth/OturumContext.jsx";
import { git } from "../hooks/useHashRota.js";

// Hesap türleri: backend'deki ROLLER listesiyle aynı (app/data/models.py)
const HESAP_TURLERI = [
  { deger: "bireysel", ad: "Bireysel" },
  { deger: "kobi", ad: "KOBİ / Esnaf" },
  { deger: "muhasebeci", ad: "Muhasebeci" },
];

export default function KayitSayfasi() {
  const { setBilgiMesaji } = useOturum();
  // Tüm form alanlarını tek bir nesnede tutuyoruz
  const [form, setForm] = useState({ ad_soyad: "", email: "", parola: "", rol: "bireysel" });
  const [hata, setHata] = useState(null); // { mesaj, ayrintilar }
  const [gonderiliyor, setGonderiliyor] = useState(false);

  // Bir alan değişince sadece o alanı güncelle: ...form -> diğer alanları koru
  const degistir = (alan) => (e) => setForm({ ...form, [alan]: e.target.value });

  // Anlık parola kontrolü (sadece bilgi amaçlı)
  const kurallar = [
    { tamam: form.parola.length >= 8, yazi: "En az 8 karakter" },
    { tamam: /[A-Za-zÇĞİÖŞÜçğıöşü]/.test(form.parola), yazi: "En az bir harf" },
    { tamam: /\d/.test(form.parola), yazi: "En az bir rakam" },
  ];

  async function gonder(olay) {
    olay.preventDefault();
    setHata(null);
    setGonderiliyor(true);
    try {
      await kayitOl(form);
      setBilgiMesaji("Kayıt başarılı. Şimdi giriş yapabilirsiniz.");
      git("/giris");
    } catch (h) {
      setHata({ mesaj: h.message, ayrintilar: h.ayrintilar || [] });
    } finally {
      setGonderiliyor(false);
    }
  }

  return (
    <section className="card form-card">
      <h1>Kayıt ol</h1>
      <form onSubmit={gonder}>
        <label>
          Ad soyad
          <input value={form.ad_soyad} onChange={degistir("ad_soyad")} autoComplete="name" required />
        </label>
        <label>
          E-posta
          <input type="email" value={form.email} onChange={degistir("email")} autoComplete="email" required />
        </label>
        <label>
          Parola
          <input type="password" value={form.parola} onChange={degistir("parola")}
                 autoComplete="new-password" required />
        </label>
        <ul className="rules">
          {kurallar.map((k) => (
            <li key={k.yazi} className={k.tamam ? "ok" : ""}>{k.tamam ? "✓" : "○"} {k.yazi}</li>
          ))}
        </ul>
        <label>
          Hesap türü
          <select value={form.rol} onChange={degistir("rol")}>
            {HESAP_TURLERI.map((t) => (
              <option key={t.deger} value={t.deger}>{t.ad}</option>
            ))}
          </select>
        </label>

        {hata && (
          <div className="error">
            {hata.mesaj}
            {hata.ayrintilar.length > 0 && (
              <ul>{hata.ayrintilar.map((a) => <li key={a}>{a}</li>)}</ul>
            )}
          </div>
        )}

        <button className="btn" disabled={gonderiliyor}>
          {gonderiliyor ? "Kaydediliyor…" : "Hesap oluştur"}
        </button>
      </form>
      <p className="muted small">
        Zaten hesabın var mı? <a href="#/giris">Giriş yap</a>
      </p>
    </section>
  );
}
