// Header.jsx - Üst menü: logo, sayfa bağlantıları, oturum bilgisi, backend durumu.
// Bağlantılar giriş durumuna ve yetkiye göre değişir.

import { useEffect, useState } from "react";
import { useOturum } from "../auth/OturumContext.jsx";
import { git } from "../hooks/useHashRota.js";
import HealthBadge from "./HealthBadge.jsx";

/** Oturumun bitmesine kalan süreyi "59 dk" biçiminde gösterir, her 30 sn'de bir yenilenir */
function KalanSure({ bitis }) {
  const [simdi, setSimdi] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setSimdi(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);
  const dakika = Math.max(0, Math.ceil((bitis - simdi) / 60000));
  return <span className="muted small" title="Oturum süresi">⏱ {dakika} dk</span>;
}

export default function Header() {
  const { kullanici, bitisZamani, cikis } = useOturum();

  async function cikisTikla() {
    await cikis();
    git("/giris");
  }

  return (
    <header className="topbar">
      <a className="brand" href="#/">
        <span className="brand-mark">B</span> Belgematik
      </a>

      <nav className="nav">
        {kullanici ? (
          <>
            <a href="#/panel">Panelim</a>
            {/* Yönetici bağlantısı sadece yöneticiye görünür (asıl koruma backend'de) */}
            {kullanici.yetki === "yonetici" && <a href="#/yonetici">Yönetici</a>}
            <span className="user">
              {kullanici.ad_soyad} <span className={`badge ${kullanici.yetki}`}>{kullanici.yetki}</span>
            </span>
            {bitisZamani && <KalanSure bitis={bitisZamani} />}
            <button className="btn btn-light" onClick={cikisTikla}>Çıkış</button>
          </>
        ) : (
          <>
            <a href="#/giris">Giriş</a>
            <a className="btn" href="#/kayit">Kayıt ol</a>
          </>
        )}
        {/* Backend'in çalışıp çalışmadığını gösteren rozet */}
        <HealthBadge />
      </nav>
    </header>
  );
}
