// ModuleList.jsx - Modüllerin geliştirme durumunu BACKEND'den çekip listeler.
// Veri artık frontend'in içinde yazılı değil; GET /api/moduller adresinden gelir.

import { useEffect, useState } from "react";
import { modulleriGetir } from "../api/client.js";

export default function ModuleList() {
  const [moduller, setModuller] = useState([]); // backend'den gelen liste
  const [yukleniyor, setYukleniyor] = useState(true); // veri bekleniyor mu?
  const [hata, setHata] = useState(null); // hata mesajı (varsa)

  useEffect(() => {
    modulleriGetir()
      .then(setModuller)
      .catch((e) => setHata(e.message))
      // finally -> başarılı da olsa hatalı da olsa en sonda çalışır
      .finally(() => setYukleniyor(false));
  }, []);

  return (
    <section>
      <h2>Geliştirme durumu</h2>

      {/* Koşullu gösterim: && -> soldaki doğruysa sağdakini göster */}
      {yukleniyor && <p className="muted">Yükleniyor…</p>}
      {hata && (
        <p className="error">
          Modüller alınamadı. Backend çalışıyor mu? ({hata})
        </p>
      )}

      {!yukleniyor && !hata && (
        <ul className="modules">
          {moduller.map((m) => (
            <li key={m.hafta} className={m.durum}>
              <span className="week">Hafta {m.hafta}</span>
              <span className="name">{m.ad}</span>
              <span className="badge">{m.durum === "hazir" ? "Hazır" : "Planlı"}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
