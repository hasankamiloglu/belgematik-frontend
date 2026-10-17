// useHashRota.js - Basit sayfa yönlendirme (router).
//
// Adres çubuğundaki # işaretinden sonraki kısma göre sayfa seçilir:
//   http://localhost:5173/#/giris     -> Giriş sayfası
//   http://localhost:5173/#/yonetici  -> Yönetici sayfası
// # kullanıldığı için sayfa yenilenmez, sunucuya istek gitmez.
// (Büyük projelerde bunun yerine "react-router" kütüphanesi kullanılır.)

import { useEffect, useState } from "react";

/** Şu anki rotayı okur: "#/giris" -> "/giris". Boşsa "/" */
function rotaOku() {
  return window.location.hash.replace(/^#/, "") || "/";
}

/** Başka sayfaya geçmek için: git("/panel") */
export function git(rota) {
  window.location.hash = rota;
}

export function useHashRota() {
  const [rota, setRota] = useState(rotaOku());

  useEffect(() => {
    // hashchange -> adres çubuğundaki # kısmı değişince tarayıcının yayınladığı olay
    const degisti = () => setRota(rotaOku());
    window.addEventListener("hashchange", degisti);
    return () => window.removeEventListener("hashchange", degisti);
  }, []);

  return rota;
}
