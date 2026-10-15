// Hero.jsx - Ana sayfanın üstündeki tanıtım bölümü (başlık + açıklama + akış).

// İşlem adımları: map() ile her biri için bir etiket oluşturulur.
const ADIMLAR = ["Yükle", "OCR", "Alan eşleme", "Doğrula", "Düzelt", "Dışa aktar"];

export default function Hero() {
  return (
    <section className="hero">
      <h1>Fişin fotoğrafını çek, verisi tabloya gelsin.</h1>
      <p className="lead">
        Belgematik; fiş, fatura ve kartvizit fotoğraflarından firma adı, vergi no,
        tarih, KDV ve toplam gibi alanları otomatik çıkarır, doğrular ve
        Excel/JSON olarak verir. KOBİ'ler ve muhasebeciler için.
      </p>
      <div className="flow">
        {ADIMLAR.map((adim, i) => (
          // key -> React'in listedeki her elemanı ayırt etmesi için benzersiz değer
          <span key={adim} className="flow-item">
            {i > 0 && <i>→</i>}
            <span className="pill">{adim}</span>
          </span>
        ))}
      </div>
    </section>
  );
}
