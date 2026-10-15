// Header.jsx - Üst menü çubuğu: logo + backend bağlantı durumu.

import HealthBadge from "./HealthBadge.jsx";

export default function Header() {
  return (
    <header className="topbar">
      <a className="brand" href="/">
        <span className="brand-mark">B</span> Belgematik
      </a>
      {/* Sağ üstte backend'in çalışıp çalışmadığını gösteren rozet */}
      <HealthBadge />
    </header>
  );
}
