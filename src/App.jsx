// App.jsx - Ana bileşen. Sayfanın tamamını oluşturan parçaları bir araya getirir.
//
// Bileşen (component) nedir? Sayfanın tekrar kullanılabilir bir parçası.
// Her bileşen bir JavaScript fonksiyonudur ve ekranda ne görüneceğini döndürür.

import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import ModuleList from "./components/ModuleList.jsx";

export default function App() {
  return (
    <>
      <Header />
      <main className="container">
        <Hero />
        <ModuleList />
      </main>
      <footer className="footer">
        Görüntüden Yapılandırılmış Veri Çıkarma · Bilgisayar Uygulamaları I Projesi
      </footer>
    </>
  );
}
