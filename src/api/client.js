// client.js - Backend API ile konuşan TEK dosya.
//
// Bileşenler (components) fetch'i doğrudan çağırmaz, bu dosyadaki
// fonksiyonları kullanır. Böylece backend adresi değişirse sadece burası değişir.

// import.meta.env.VITE_API_URL -> .env dosyasındaki backend adresi.
// .env yoksa varsayılan olarak yerel backend kullanılır.
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

// Token'ın tarayıcıda saklandığı anahtar adı (localStorage).
export const TOKEN_ANAHTARI = "belgematik_token";

/** API'den gelen hataları taşıyan sınıf: mesaj + HTTP durum kodu + ayrıntılar */
export class ApiHatasi extends Error {
  constructor(mesaj, durum, ayrintilar = []) {
    super(mesaj);
    this.durum = durum; // ör. 401, 403, 409
    this.ayrintilar = ayrintilar; // ör. parola kuralları listesi
  }
}

/**
 * Backend'e istek atar ve JSON cevabı döndürür.
 * @param {string} yol    - Örnek: "/saglik" veya "/auth/giris"
 * @param {object} ayar   - { method: "GET" | "POST" | "DELETE", govde: gönderilecek veri,
 *                            ham: true ise cevap dosya (blob) olarak döner }
 * @returns {Promise<any>} Backend'in döndürdüğü veri
 */
async function istek(yol, { method = "GET", govde, ham = false } = {}) {
  const basliklar = {};
  // FormData -> dosya yüklerken kullanılır. Bu durumda Content-Type'ı tarayıcı
  // kendisi ayarlar (multipart/form-data); biz JSON demiyoruz.
  const dosyaMi = govde instanceof FormData;
  if (govde !== undefined && !dosyaMi) basliklar["Content-Type"] = "application/json";

  // Giriş yapılmışsa token'ı her isteğe ekle: "Authorization: Bearer <token>"
  const token = localStorage.getItem(TOKEN_ANAHTARI);
  if (token) basliklar["Authorization"] = `Bearer ${token}`;

  // fetch -> tarayıcının internetten veri isteme fonksiyonu.
  // await -> cevap gelene kadar bekle (sayfa donmaz, arka planda bekler).
  const cevap = await fetch(`${API_URL}${yol}`, {
    method,
    headers: basliklar,
    // JSON.stringify -> JavaScript nesnesini JSON metnine çevirir
    body: govde === undefined ? undefined : dosyaMi ? govde : JSON.stringify(govde),
  });

  // ham=true -> JSON değil dosya (görsel) bekleniyor; başarılıysa olduğu gibi döndür
  if (ham && cevap.ok) return cevap.blob();

  // Cevabı JSON olarak oku (boş cevapta hata vermesin diye catch)
  const veri = await cevap.json().catch(() => ({}));

  // cevap.ok -> durum kodu 200-299 arasındaysa true. Değilse hata fırlat.
  if (!cevap.ok) {
    // Token gönderdik ama 401 geldiyse oturum bitmiş/geçersiz demektir.
    // Tüm uygulamaya "oturum bitti" olayı duyurulur (OturumContext dinler).
    if (cevap.status === 401 && token) {
      window.dispatchEvent(new CustomEvent("oturum-bitti", { detail: veri.hata }));
    }
    throw new ApiHatasi(veri.hata || `API hatası: ${cevap.status}`, cevap.status, veri.ayrintilar);
  }
  return veri;
}

// Dışarıya açılan fonksiyonlar (bileşenler bunları kullanır):
export const saglikKontrolu = () => istek("/saglik");
export const modulleriGetir = () => istek("/moduller");

// --- Hafta 5: kimlik doğrulama ---
export const kayitOl = (bilgiler) => istek("/auth/kayit", { method: "POST", govde: bilgiler });
export const girisYap = (email, parola) =>
  istek("/auth/giris", { method: "POST", govde: { email, parola } });
export const benKimim = () => istek("/auth/ben");
export const cikisYap = () => istek("/auth/cikis", { method: "POST", govde: {} });
export const yoneticiOzeti = () => istek("/yonetici/kullanicilar");

// --- Hafta 6: belge yükleme ---
/** Dosyayı yükler. FormData -> tarayıcının dosya gönderme biçimi (alan adı: "dosya") */
export function belgeYukle(dosya) {
  const form = new FormData();
  form.append("dosya", dosya);
  return istek("/belgeler", { method: "POST", govde: form });
}
export const belgeleriGetir = () => istek("/belgeler");
export const belgeSil = (id) => istek(`/belgeler/${id}`, { method: "DELETE" });

/**
 * Belgenin görselini indirir ve <img> etiketinde kullanılabilecek geçici adres döndürür.
 * Neden doğrudan <img src="..."> değil? Görsel adresi KORUMALI (token ister) ve
 * <img> etiketi Authorization başlığı gönderemez. Bu yüzden fetch ile token'lı
 * indirip URL.createObjectURL ile tarayıcı içinde geçici bir adres oluşturuyoruz.
 * @param {"orijinal"|"islenmis"|"kucuk"} tur
 */
export async function gorselAdresi(id, tur) {
  const blob = await istek(`/belgeler/${id}/gorsel?tur=${tur}`, { ham: true });
  return URL.createObjectURL(blob);
}
