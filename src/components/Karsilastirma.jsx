// Karsilastirma.jsx - Orijinal görsel ile ön işlenmiş görseli yan yana gösteren pencere.
// Ön işlemenin ne yaptığını (döndürme, gri ton, kontrast) gözle görmeyi sağlar.

import KorumaliGorsel from "./KorumaliGorsel.jsx";

export default function Karsilastirma({ belge, kapat }) {
  return (
    // Arka plana tıklayınca kapanır; içeriğe tıklama kapatmasın diye stopPropagation
    <div className="modal-arka" onClick={kapat}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-baslik">
          <h2>{belge.dosya_adi}</h2>
          <button className="btn btn-light" onClick={kapat}>Kapat</button>
        </div>

        <div className="kiyas">
          <figure>
            <figcaption>Orijinal</figcaption>
            <KorumaliGorsel belgeId={belge.id} tur="orijinal" alt="Orijinal görsel" />
          </figure>
          <figure>
            <figcaption>Ön işlenmiş (OCR'a gidecek)</figcaption>
            <KorumaliGorsel belgeId={belge.id} tur="islenmis" alt="Ön işlenmiş görsel" />
          </figure>
        </div>

        <p className="muted small">
          Yapılanlar: yön düzeltme (EXIF) · gri tonlama · en fazla 2000 piksele küçültme ·
          otomatik kontrast · keskinleştirme. Boyut: {belge.genislik}×{belge.yukseklik} px ·
          Kalite: {belge.kalite_puani}/100
        </p>
      </div>
    </div>
  );
}
