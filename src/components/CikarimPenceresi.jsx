// CikarimPenceresi.jsx - Belgeden veri çıkarma penceresi (Hafta 7).
//
// 1) Kullanıcı şema seçer (fiş / fatura / kartvizit / kendi şeması)
// 2) "Verileri çıkar" -> backend: OCR -> alan eşleme -> doğrulama -> kayıt
// 3) Sonuç tablosu: her alanın değeri, güveni ve doğrulama sonucu + iş kuralları
//
// Bu ekran hiçbir kontrolü kendisi yapmaz; hepsi backend'de yapılır, burada sadece gösterilir.

import { useEffect, useState } from "react";
import { belgeIsle, cikarimGetir, semalariGetir } from "../api/client.js";
import KorumaliGorsel from "./KorumaliGorsel.jsx";

// Alan adlarının ekranda okunacak hâli: toplam_tutar -> "Toplam tutar"
const okunakli = (ad) => ad.charAt(0).toUpperCase() + ad.slice(1).replaceAll("_", " ");

// Değerleri veri tipine göre Türkçe gösterir: 247.50 -> "247,50 TL", 2026-10-12 -> "12.10.2026"
function goster(alan) {
  if (alan.deger == null) return <span className="muted">— bulunamadı</span>;
  if (alan.veri_tipi === "para")
    return Number(alan.deger).toLocaleString("tr-TR", { minimumFractionDigits: 2 }) + " TL";
  if (alan.veri_tipi === "tarih") return new Date(alan.deger).toLocaleDateString("tr-TR");
  if (alan.alan_adi === "kdv_orani") return `%${alan.deger}`;
  return alan.deger;
}

export default function CikarimPenceresi({ belge, kapat, islendi }) {
  const [semalar, setSemalar] = useState([]);
  const [semaId, setSemaId] = useState("");
  const [sonuc, setSonuc] = useState(null);
  const [calisiyor, setCalisiyor] = useState(false);
  const [hata, setHata] = useState("");

  useEffect(() => {
    // Şema listesini al; belge daha önce işlendiyse son sonucu da getir
    semalariGetir()
      .then((v) => {
        setSemalar(v.semalar);
        if (v.semalar.length) setSemaId((onceki) => onceki || v.semalar[0].id);
      })
      .catch((h) => setHata(h.message));
    if (belge.durum === "islendi") {
      cikarimGetir(belge.id)
        .then((v) => {
          setSonuc(v);
          setSemaId(v.sema.id);
        })
        .catch(() => {}); // henüz sonuç yoksa sessizce geç
    }
  }, [belge.id, belge.durum]);

  async function isle() {
    setCalisiyor(true);
    setHata("");
    try {
      const v = await belgeIsle(belge.id, Number(semaId));
      setSonuc(v);
      islendi(); // listeyi yenile (belge durumu "İşlendi" olur)
    } catch (h) {
      setHata(h.message);
    } finally {
      setCalisiyor(false);
    }
  }

  const sorunlu = sonuc
    ? sonuc.alanlar.filter((a) => !a.gecerli_mi).length + sonuc.kural_sonuclari.filter((k) => !k.gecerli).length
    : 0;

  return (
    <div className="modal-arka" onClick={kapat}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-baslik">
          <h2>{belge.dosya_adi}</h2>
          <button className="btn btn-light" onClick={kapat}>Kapat</button>
        </div>

        <div className="isle-satiri">
          <label>
            Şema
            <select value={semaId} onChange={(e) => setSemaId(e.target.value)}>
              {semalar.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.ad} {s.sistem_semasi_mi ? "" : "(benim)"}
                </option>
              ))}
            </select>
          </label>
          <button className="btn" onClick={isle} disabled={calisiyor || !semaId}>
            {calisiyor ? "Okunuyor…" : sonuc ? "Tekrar çıkar" : "Verileri çıkar"}
          </button>
        </div>
        {hata && <p className="error">{hata}</p>}

        {sonuc && (
          <div className="cikarim">
            <div className="cikarim-gorsel">
              <KorumaliGorsel belgeId={belge.id} tur="islenmis" alt="Ön işlenmiş görsel" />
            </div>

            <div className="cikarim-sonuc">
              <div className={`sonuc ${sorunlu ? "uyari" : "basari"}`}>
                {sorunlu ? (
                  <b>⚠ {sorunlu} sorun bulundu — kontrol edin</b>
                ) : (
                  <b>✓ Tüm alanlar ve kurallar doğrulandı</b>
                )}
                <span className="small">
                  Şema: {sonuc.sema.ad} · OCR: {sonuc.ocr_motoru} · okuma güveni %
                  {Math.round(sonuc.ocr_guveni * 100)}
                </span>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>Alan</th><th>Değer</th><th>Güven</th><th>Doğrulama</th></tr>
                  </thead>
                  <tbody>
                    {sonuc.alanlar.map((a) => (
                      <tr key={a.alan_adi} className={a.gecerli_mi ? "" : "satir-hatali"}>
                        <td>
                          {okunakli(a.alan_adi)}
                          {a.zorunlu_mu && <span className="zorunlu" title="Zorunlu alan">*</span>}
                        </td>
                        <td><b>{goster(a)}</b></td>
                        <td>{a.guven_skoru != null ? `%${Math.round(a.guven_skoru * 100)}` : "—"}</td>
                        <td className="hucre-uzun">
                          {a.gecerli_mi ? <span className="ok-text">✓</span>
                            : <span className="err-text">✗ {a.hata_mesaji}</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {sonuc.kural_sonuclari.length > 0 && (
                <>
                  <h3>İş kuralları</h3>
                  <ul className="kurallar">
                    {sonuc.kural_sonuclari.map((k) => (
                      <li key={k.kural} className={k.gecerli ? "ok-text" : "err-text"}>
                        {k.gecerli ? "✓" : "✗"} <b>{k.kural}</b> — {k.mesaj}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {/* details -> tıklayınca açılan bölüm */}
              <details>
                <summary>OCR'ın okuduğu ham metin</summary>
                <pre className="ham-metin">{sonuc.ham_metin}</pre>
              </details>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
