// App.jsx - Ana bileşen. Adrese (rota) göre hangi sayfanın gösterileceğine karar verir.
//
// Bileşen (component) nedir? Sayfanın tekrar kullanılabilir bir parçası.
// Her bileşen bir JavaScript fonksiyonudur ve ekranda ne görüneceğini döndürür.
//
// Sayfalar ve erişim kuralları:
//   #/          -> Ana sayfa          (herkes)
//   #/giris     -> Giriş              (herkes)
//   #/kayit     -> Kayıt              (herkes)
//   #/panel     -> Kişisel panel      (giriş yapmış herkes)
//   #/yonetici  -> Yönetici paneli    (sadece yönetici)

import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import KorumaliSayfa from "./components/KorumaliSayfa.jsx";
import ModuleList from "./components/ModuleList.jsx";
import { useHashRota } from "./hooks/useHashRota.js";
import GirisSayfasi from "./pages/GirisSayfasi.jsx";
import KayitSayfasi from "./pages/KayitSayfasi.jsx";
import PanelSayfasi from "./pages/PanelSayfasi.jsx";
import YoneticiSayfasi from "./pages/YoneticiSayfasi.jsx";

function Sayfa({ rota }) {
  switch (rota) {
    case "/giris":
      return <GirisSayfasi />;
    case "/kayit":
      return <KayitSayfasi />;
    case "/panel":
      return (
        <KorumaliSayfa>
          <PanelSayfasi />
        </KorumaliSayfa>
      );
    case "/yonetici":
      return (
        <KorumaliSayfa yetki="yonetici">
          <YoneticiSayfasi />
        </KorumaliSayfa>
      );
    case "/":
      return (
        <>
          <Hero />
          <ModuleList />
        </>
      );
    default:
      return (
        <section className="card center">
          <div className="big-code">404</div>
          <h2>Sayfa bulunamadı</h2>
          <a className="btn" href="#/">Ana sayfa</a>
        </section>
      );
  }
}

export default function App() {
  const rota = useHashRota(); // adres çubuğundaki #/... kısmı

  return (
    <>
      <Header />
      <main className="container">
        <Sayfa rota={rota} />
      </main>
      <footer className="footer">
        Görüntüden Yapılandırılmış Veri Çıkarma · Bilgisayar Uygulamaları I Projesi
      </footer>
    </>
  );
}
