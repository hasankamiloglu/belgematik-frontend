// GirisSayfasi.jsx - E-posta + parola ile giriş formu.

import { useState } from "react";
import { useOturum } from "../auth/OturumContext.jsx";
import { git } from "../hooks/useHashRota.js";

export default function GirisSayfasi() {
  const { giris, bilgiMesaji } = useOturum();
  const [email, setEmail] = useState("");
  const [parola, setParola] = useState("");
  const [hata, setHata] = useState("");
  const [gonderiliyor, setGonderiliyor] = useState(false); // butonu iki kez basmayı engeller

  async function gonder(olay) {
    olay.preventDefault(); // formun sayfayı yenilemesini engelle
    setHata("");
    setGonderiliyor(true);
    try {
      const kullanici = await giris(email, parola);
      // Yönetici ise yönetici paneline, değilse kendi paneline git
      git(kullanici.yetki === "yonetici" ? "/yonetici" : "/panel");
    } catch (h) {
      // Backend'in mesajı: "E-posta veya parola hatalı." ya da kilit mesajı (429)
      setHata(h.message);
    } finally {
      setGonderiliyor(false);
    }
  }

  return (
    <section className="card form-card">
      <h1>Giriş yap</h1>
      {bilgiMesaji && <p className="info">{bilgiMesaji}</p>}

      <form onSubmit={gonder}>
        <label>
          E-posta
          {/* onChange -> her tuşta state güncellenir (kontrollü bileşen) */}
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                 autoComplete="email" required />
        </label>
        <label>
          Parola
          {/* type="password" -> yazılanlar ekranda ● olarak görünür */}
          <input type="password" value={parola} onChange={(e) => setParola(e.target.value)}
                 autoComplete="current-password" required />
        </label>

        {hata && <p className="error">{hata}</p>}

        <button className="btn" disabled={gonderiliyor}>
          {gonderiliyor ? "Kontrol ediliyor…" : "Giriş yap"}
        </button>
      </form>

      <p className="muted small">
        Hesabın yok mu? <a href="#/kayit">Kayıt ol</a>
      </p>
    </section>
  );
}
