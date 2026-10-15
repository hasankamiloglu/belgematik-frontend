// client.js - Backend API ile konuşan TEK dosya.
//
// Bileşenler (components) fetch'i doğrudan çağırmaz, bu dosyadaki
// fonksiyonları kullanır. Böylece backend adresi değişirse sadece burası değişir.

// import.meta.env.VITE_API_URL -> .env dosyasındaki backend adresi.
// .env yoksa varsayılan olarak yerel backend kullanılır.
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

/**
 * Backend'e GET isteği atar ve JSON cevabı döndürür.
 * @param {string} yol - Örnek: "/saglik" veya "/moduller"
 * @returns {Promise<any>} Backend'in döndürdüğü veri
 */
async function getJson(yol) {
  // fetch -> tarayıcının internetten veri isteme fonksiyonu.
  // await -> cevap gelene kadar bekle (sayfa donmaz, arka planda bekler).
  const cevap = await fetch(`${API_URL}${yol}`);

  // cevap.ok -> durum kodu 200-299 arasındaysa true. Değilse hata fırlat.
  if (!cevap.ok) {
    throw new Error(`API hatası: ${cevap.status}`);
  }
  return cevap.json();
}

// Dışarıya açılan fonksiyonlar (bileşenler bunları kullanır):
export const saglikKontrolu = () => getJson("/saglik");
export const modulleriGetir = () => getJson("/moduller");
