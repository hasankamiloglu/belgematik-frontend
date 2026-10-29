// YuklemeAlani.jsx - Dosya seçme / sürükle-bırak alanı.
//
// Burada yapılan kontroller (tür, boyut) sadece KULLANICIYA HIZLI GERİ BİLDİRİM içindir.
// Asıl kontrol backend'dedir (app/services/belge_servisi.py): biri bu kontrolü
// atlatsa bile sunucu dosyayı yine reddeder.

import { useRef, useState } from "react";

const IZINLI = ["png", "jpg", "jpeg", "pdf"];
const EN_BUYUK_MB = 10;

export default function YuklemeAlani({ onDosya, yukleniyor }) {
  const [surukleniyor, setSurukleniyor] = useState(false); // dosya alanın üstünde mi?
  const [hata, setHata] = useState("");
  const girdi = useRef(null); // gizli <input type="file"> elemanına erişim

  function kontrolEtVeGonder(dosya) {
    if (!dosya) return;
    setHata("");
    const uzanti = dosya.name.split(".").pop().toLowerCase();
    if (!IZINLI.includes(uzanti)) {
      setHata("Sadece PNG, JPG/JPEG veya PDF seçebilirsiniz.");
      return;
    }
    if (dosya.size > EN_BUYUK_MB * 1024 * 1024) {
      setHata(`Dosya ${EN_BUYUK_MB} MB'tan büyük olamaz.`);
      return;
    }
    onDosya(dosya); // üst bileşene (BelgelerSayfasi) gönder
  }

  return (
    <div
      className={`drop ${surukleniyor ? "aktif" : ""}`}
      // Sürükle-bırak olayları. preventDefault -> tarayıcı dosyayı kendisi açmasın
      onDragOver={(e) => { e.preventDefault(); setSurukleniyor(true); }}
      onDragLeave={() => setSurukleniyor(false)}
      onDrop={(e) => {
        e.preventDefault();
        setSurukleniyor(false);
        kontrolEtVeGonder(e.dataTransfer.files[0]);
      }}
      onClick={() => !yukleniyor && girdi.current.click()}
    >
      <input
        ref={girdi}
        type="file"
        hidden
        // accept -> dosya seçme penceresinde sadece bu türler görünür
        // (telefonda "Kamera" seçeneği de çıkar)
        accept=".png,.jpg,.jpeg,.pdf,image/png,image/jpeg,application/pdf"
        onChange={(e) => {
          kontrolEtVeGonder(e.target.files[0]);
          e.target.value = ""; // aynı dosya tekrar seçilebilsin
        }}
      />
      <div className="drop-icon">⬆</div>
      {yukleniyor ? (
        <p><b>Yükleniyor ve ön işleniyor…</b></p>
      ) : (
        <>
          <p><b>Fiş veya fatura fotoğrafını buraya sürükleyin</b> ya da tıklayıp seçin</p>
          <p className="muted small">PNG, JPG, PDF · en fazla 10 MB · her yükleme 1 kredi</p>
        </>
      )}
      {hata && <p className="error" onClick={(e) => e.stopPropagation()}>{hata}</p>}
    </div>
  );
}
