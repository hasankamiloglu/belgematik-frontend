// HealthBadge.jsx - Backend'e /api/saglik isteği atar ve sonucu rozet olarak gösterir.
// Frontend ile backend'in birbiriyle konuşabildiğinin canlı kanıtıdır.

import { useEffect, useState } from "react";
import { saglikKontrolu } from "../api/client.js";

export default function HealthBadge() {
  // useState -> bileşenin "hafızası". durum değişince ekran otomatik yenilenir.
  // Olası değerler: "kontrol" (bekleniyor), "bagli" (başarılı), "hata" (ulaşılamadı)
  const [durum, setDurum] = useState("kontrol");
  const [surum, setSurum] = useState("");

  // useEffect -> bileşen ekrana ilk geldiğinde BİR KEZ çalışır.
  // Sondaki boş dizi [] -> "sadece ilk açılışta çalış" demektir.
  useEffect(() => {
    saglikKontrolu()
      .then((veri) => {
        setDurum("bagli");
        setSurum(veri.surum);
      })
      .catch(() => setDurum("hata"));
  }, []);

  const yazilar = {
    kontrol: "Backend kontrol ediliyor…",
    bagli: `API bağlı · v${surum}`,
    hata: "API'ye ulaşılamadı",
  };

  // className={`health ${durum}`} -> duruma göre rengi değişen CSS sınıfı
  return <span className={`health ${durum}`}>{yazilar[durum]}</span>;
}
