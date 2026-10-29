// BelgelerSayfasi.jsx - Belge yükleme ve "Belgelerim" listesi (Hafta 6).
// App.jsx'te <KorumaliSayfa> içinde: sadece giriş yapmış kullanıcı görür.
// Liste backend'den gelir ve SADECE bu kullanıcının belgelerini içerir.

import { useEffect, useState } from "react";
import { belgeSil, belgeYukle, belgeleriGetir } from "../api/client.js";
import Karsilastirma from "../components/Karsilastirma.jsx";
import KorumaliGorsel from "../components/KorumaliGorsel.jsx";
import YuklemeAlani from "../components/YuklemeAlani.jsx";

// Durum kodlarının ekranda görünecek adları
const DURUM_ADI = {
  yuklendi: "Yüklendi",
  on_islendi: "OCR'a hazır",
  islendi: "İşlendi",
  hatali: "Hatalı",
};

const tarih = (t) => new Date(t).toLocaleString("tr-TR");

/** Kalite puanına göre renk sınıfı: 80+ iyi, 50+ orta, altı zayıf */
const kaliteSinifi = (p) => (p >= 80 ? "iyi" : p >= 50 ? "orta" : "zayif");

export default function BelgelerSayfasi() {
  const [belgeler, setBelgeler] = useState([]);
  const [kredi, setKredi] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [sonuc, setSonuc] = useState(null); // son yüklemenin sonucu (başarı/uyarı)
  const [hata, setHata] = useState("");
  const [secili, setSecili] = useState(null); // karşılaştırma penceresinde açık belge

  // Listeyi backend'den yeniden çeker
  function yenile() {
    belgeleriGetir()
      .then((veri) => {
        setBelgeler(veri.belgeler);
        setKredi(veri.kalan_kredi);
      })
      .catch((h) => setHata(h.message));
  }

  useEffect(yenile, []); // sayfa açılınca bir kez

  async function yukle(dosya) {
    setYukleniyor(true);
    setHata("");
    setSonuc(null);
    try {
      const veri = await belgeYukle(dosya);
      setSonuc(veri.belge);
      setKredi(veri.kalan_kredi);
      yenile();
    } catch (h) {
      // Backend'in mesajı: düşük kalite, aynı dosya (409), kredi bitti (402) vb.
      setHata(h.message);
    } finally {
      setYukleniyor(false);
    }
  }

  async function sil(belge) {
    // confirm -> tarayıcının "Emin misiniz?" penceresi
    if (!window.confirm(`"${belge.dosya_adi}" silinsin mi? (Harcanan kredi iade edilmez.)`)) return;
    try {
      await belgeSil(belge.id);
      yenile();
    } catch (h) {
      setHata(h.message);
    }
  }

  return (
    <section>
      <div className="sayfa-baslik">
        <h1>Belgelerim</h1>
        {kredi !== null && (
          <span className={`kredi ${kredi === 0 ? "bitti" : ""}`}>Kalan kredi: <b>{kredi}</b></span>
        )}
      </div>

      <YuklemeAlani onDosya={yukle} yukleniyor={yukleniyor} />

      {hata && <p className="error">{hata}</p>}

      {sonuc && (
        <div className={`sonuc ${sonuc.kalite_uyarilari.length ? "uyari" : "basari"}`}>
          <b>✓ "{sonuc.dosya_adi}" yüklendi.</b>{" "}
          {sonuc.kalite_puani != null && <>Kalite puanı: <b>{sonuc.kalite_puani}/100</b></>}
          {sonuc.kalite_uyarilari.length > 0 && (
            <ul>{sonuc.kalite_uyarilari.map((u) => <li key={u}>⚠ {u}</li>)}</ul>
          )}
          {sonuc.on_islenmis && (
            <button className="btn btn-light" onClick={() => setSecili(sonuc)}>
              Orijinal / işlenmiş karşılaştır
            </button>
          )}
        </div>
      )}

      <h2>Yüklenen belgeler ({belgeler.length})</h2>
      {belgeler.length === 0 && <p className="muted">Henüz belge yüklemediniz.</p>}

      <div className="belge-grid">
        {belgeler.map((b) => (
          <article key={b.id} className="card belge">
            {b.on_islenmis ? (
              <button className="onizleme" onClick={() => setSecili(b)} title="Karşılaştır">
                <KorumaliGorsel belgeId={b.id} tur="kucuk" alt={b.dosya_adi} />
              </button>
            ) : (
              <div className="onizleme gorsel-yok">{b.dosya_turu.toUpperCase()}</div>
            )}
            <div className="belge-bilgi">
              <b title={b.dosya_adi}>{b.dosya_adi}</b>
              <span className="muted small">{tarih(b.yuklenme_tarihi)} · {b.boyut_kb} KB</span>
              <div className="etiketler">
                <span className={`badge durum-${b.durum}`}>{DURUM_ADI[b.durum] || b.durum}</span>
                {b.kalite_puani != null && (
                  <span className={`badge kalite-${kaliteSinifi(b.kalite_puani)}`}>
                    Kalite {b.kalite_puani}
                  </span>
                )}
              </div>
              {b.kalite_uyarilari.map((u) => <span key={u} className="uyari-yazi">⚠ {u}</span>)}
              <button className="link-btn" onClick={() => sil(b)}>Sil</button>
            </div>
          </article>
        ))}
      </div>

      {secili && <Karsilastirma belge={secili} kapat={() => setSecili(null)} />}
    </section>
  );
}
