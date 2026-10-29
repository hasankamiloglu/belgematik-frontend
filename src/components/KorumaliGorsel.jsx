// KorumaliGorsel.jsx - Token gerektiren bir görseli indirip gösterir.
//
// Kullanım: <KorumaliGorsel belgeId={5} tur="kucuk" alt="Fiş" />
// Görsel yoksa (ör. PDF veya örnek veri) yerine bir simge gösterilir.

import { useEffect, useState } from "react";
import { gorselAdresi } from "../api/client.js";

export default function KorumaliGorsel({ belgeId, tur, alt, className = "" }) {
  const [adres, setAdres] = useState(null); // tarayıcı içi geçici adres (blob:...)
  const [hata, setHata] = useState(false);

  useEffect(() => {
    let iptal = false; // bileşen kaldırıldıysa state güncellemesin
    let olusan = null;
    gorselAdresi(belgeId, tur)
      .then((a) => {
        olusan = a;
        if (!iptal) setAdres(a);
      })
      .catch(() => !iptal && setHata(true));

    // Temizlik: geçici adres bellekte yer kaplar, işimiz bitince serbest bırakıyoruz
    return () => {
      iptal = true;
      if (olusan) URL.revokeObjectURL(olusan);
    };
  }, [belgeId, tur]);

  if (hata) return <div className={`gorsel-yok ${className}`}>Önizleme yok</div>;
  if (!adres) return <div className={`gorsel-yok ${className}`}>…</div>;
  return <img src={adres} alt={alt} className={className} />;
}
