// SemalarSayfasi.jsx - Şema tanımı ekranı (Hafta 7).
//
// Şema = bir belge türünün kalıbı: hangi alanlar var, tipi ne, zorunlu mu,
// metinde hangi anahtar kelimelerle aranacak, hangi kurala uymalı.
//   - Sistem şemaları (fiş, fatura, kartvizit) herkese açıktır, silinemez.
//   - Kullanıcı kendi şemasını oluşturabilir; sadece kendisi görür.

import { useEffect, useState } from "react";
import { semaOlustur, semaSil, semalariGetir } from "../api/client.js";

const VERI_TIPLERI = [
  { deger: "metin", ad: "Metin" },
  { deger: "para", ad: "Para" },
  { deger: "tarih", ad: "Tarih" },
  { deger: "sayi", ad: "Sayı" },
];

const BOS_ALAN = { alan_adi: "", veri_tipi: "metin", zorunlu_mu: false, anahtar_kelimeler: "", dogrulama_kurali: "" };

export default function SemalarSayfasi() {
  const [semalar, setSemalar] = useState([]);
  const [hata, setHata] = useState(null);
  const [form, setForm] = useState({ ad: "", aciklama: "", alanlar: [{ ...BOS_ALAN }] });
  const [mesaj, setMesaj] = useState("");

  const yenile = () =>
    semalariGetir()
      .then((v) => setSemalar(v.semalar))
      .catch((h) => setHata({ mesaj: h.message, ayrintilar: [] }));
  useEffect(() => {
    yenile();
  }, []);

  // i. alanın bir özelliğini değiştir (diğer alanlara dokunmadan)
  function alanDegistir(i, ozellik, deger) {
    const alanlar = form.alanlar.map((a, j) => (j === i ? { ...a, [ozellik]: deger } : a));
    setForm({ ...form, alanlar });
  }

  async function kaydet(olay) {
    olay.preventDefault();
    setHata(null);
    setMesaj("");
    try {
      await semaOlustur(form);
      setMesaj(`"${form.ad}" şeması oluşturuldu.`);
      setForm({ ad: "", aciklama: "", alanlar: [{ ...BOS_ALAN }] });
      yenile();
    } catch (h) {
      setHata({ mesaj: h.message, ayrintilar: h.ayrintilar || [] });
    }
  }

  async function sil(sema) {
    if (!window.confirm(`"${sema.ad}" şeması silinsin mi?`)) return;
    try {
      await semaSil(sema.id);
      yenile();
    } catch (h) {
      setHata({ mesaj: h.message, ayrintilar: [] });
    }
  }

  return (
    <section>
      <h1>Şemalar</h1>
      <p className="muted">
        Şema, bir belgeden hangi alanların çıkarılacağını ve nasıl doğrulanacağını belirler.
      </p>

      {hata && (
        <div className="error">
          {hata.mesaj}
          {hata.ayrintilar.length > 0 && <ul>{hata.ayrintilar.map((a) => <li key={a}>{a}</li>)}</ul>}
        </div>
      )}

      <div className="sema-grid">
        {semalar.map((s) => (
          <article key={s.id} className="card">
            <div className="sema-baslik">
              <h2>{s.ad}</h2>
              <span className={`badge ${s.sistem_semasi_mi ? "kullanici" : "yonetici"}`}>
                {s.sistem_semasi_mi ? "sistem" : "benim"}
              </span>
            </div>
            {s.aciklama && <p className="muted small">{s.aciklama}</p>}
            <ul className="alan-listesi">
              {s.alanlar.map((a) => (
                <li key={a.id}>
                  <b>{a.alan_adi}</b>
                  {a.zorunlu_mu && <span className="zorunlu">*</span>}{" "}
                  <span className="muted small">{a.veri_tipi}</span>
                  {a.anahtar_kelimeler && (
                    <div className="muted small kelimeler" title="Anahtar kelimeler">🔎 {a.anahtar_kelimeler}</div>
                  )}
                </li>
              ))}
            </ul>
            {!s.sistem_semasi_mi && (
              <button className="link-btn" onClick={() => sil(s)}>Şemayı sil</button>
            )}
          </article>
        ))}
      </div>

      <h2>Yeni şema tanımla</h2>
      <form className="card sema-form" onSubmit={kaydet}>
        <div className="form-ikili">
          <label>
            Şema adı
            <input value={form.ad} placeholder="ör. kira_makbuzu"
                   onChange={(e) => setForm({ ...form, ad: e.target.value })} required />
          </label>
          <label>
            Açıklama
            <input value={form.aciklama} onChange={(e) => setForm({ ...form, aciklama: e.target.value })} />
          </label>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Alan adı</th><th>Tip</th><th>Zorunlu</th><th>Anahtar kelimeler</th><th>Kural (regex)</th><th></th></tr>
            </thead>
            <tbody>
              {form.alanlar.map((a, i) => (
                <tr key={i}>
                  <td><input value={a.alan_adi} placeholder="makbuz_no"
                             onChange={(e) => alanDegistir(i, "alan_adi", e.target.value)} /></td>
                  <td>
                    <select value={a.veri_tipi} onChange={(e) => alanDegistir(i, "veri_tipi", e.target.value)}>
                      {VERI_TIPLERI.map((t) => <option key={t.deger} value={t.deger}>{t.ad}</option>)}
                    </select>
                  </td>
                  <td><input type="checkbox" checked={a.zorunlu_mu}
                             onChange={(e) => alanDegistir(i, "zorunlu_mu", e.target.checked)} /></td>
                  <td><input value={a.anahtar_kelimeler} placeholder="MAKBUZ NO,NO"
                             onChange={(e) => alanDegistir(i, "anahtar_kelimeler", e.target.value)} /></td>
                  <td><input value={a.dogrulama_kurali} placeholder="^[0-9]{6}$"
                             onChange={(e) => alanDegistir(i, "dogrulama_kurali", e.target.value)} /></td>
                  <td>
                    {form.alanlar.length > 1 && (
                      <button type="button" className="link-btn"
                              onClick={() => setForm({ ...form, alanlar: form.alanlar.filter((_, j) => j !== i) })}>
                        Kaldır
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="muted small">
          Anahtar kelimeler virgülle ayrılır. Başına "-" konan kelime o satırı eler
          (ör. <code>TOPLAM,-ARA</code> → "ARA TOPLAM" satırı alınmaz).
        </p>
        <div className="form-butonlar">
          <button type="button" className="btn btn-light"
                  onClick={() => setForm({ ...form, alanlar: [...form.alanlar, { ...BOS_ALAN }] })}>
            + Alan ekle
          </button>
          <button className="btn">Şemayı kaydet</button>
        </div>
        {mesaj && <p className="ok-text">{mesaj}</p>}
      </form>
    </section>
  );
}
