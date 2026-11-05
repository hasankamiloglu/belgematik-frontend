# Değişiklik Günlüğü (CHANGELOG) – belgematik-frontend

Sürümler **Anlamsal Sürümleme** (`MAJOR.MINOR.PATCH`) kuralına uyar. Ayrıntı: backend deposundaki CHANGELOG.
Ara sürümde (vize) iki depo da **aynı numarayla** etiketlendi: `v0.7.0`. Böylece hangi frontend'in hangi backend ile çalıştığı bellidir.

## [0.7.0] – Hafta 8 · Ara sürüm (vize) 🏷️ `v0.7.0`
### Eklendi
- GitHub Actions: her `git push`ta `npm run build` ile derlemenin bozulmadığı kontrol edilir
### Düzeltildi
- "Çıkış yapıldı" gibi bilgi mesajları hafızada kalıp sonradan ilgisiz yerde görünüyordu → ana sayfa veya kayıt sayfasına geçince temizleniyor
- Panelim sayfası girişteki eski kredi bilgisini gösteriyordu → sayfa açılınca güncel bilgi alınıyor

## [0.5.0] – Hafta 7
- "Verileri çıkar" penceresi (alanlar, güven, doğrulama, iş kuralları, ham metin), Şemalar sayfası

## [0.4.0] – Hafta 6
- Belgelerim sayfası, sürükle-bırak yükleme, kalite rozetleri, orijinal/işlenmiş karşılaştırma

## [0.3.0] – Hafta 5
- Giriş, kayıt, korumalı sayfalar, yönetici paneli, oturum süresi, otomatik çıkış

## [0.2.0] – Hafta 3
- React + Vite iskeleti, backend bağlantısı, modül listesi
