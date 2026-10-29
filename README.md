# Belgematik – Frontend (React)

**Fiş, fatura ve kartvizit fotoğraflarından yapılandırılmış veri çıkaran uygulamanın kullanıcı arayüzü.**

> Proje iki ayrı depodan oluşur:
> - **belgematik-frontend** (bu depo): React + Vite arayüzü
> - **[belgematik-backend](https://github.com/hasankamiloglu/belgematik-backend)**: Python + Flask API
>
> Frontend, verileri backend'den **HTTP istekleriyle (JSON)** alır.
> Durum: **v0.4 – Belge yükleme ve ön işleme ekranı (Hafta 6)**

## Teknolojiler

React 19 · Vite · JavaScript (JSX) · CSS · fetch API

## Mimari

![Mimari şema](docs/mimari-sema.png)

```
src/
├── main.jsx            # Uygulamanın başlangıç noktası
├── App.jsx             # Ana bileşen (sayfayı oluşturan parçaları birleştirir)
├── styles.css          # Ortak stiller
├── api/
│   └── client.js       # Backend ile konuşan TEK dosya (fetch + token)
├── auth/
│   └── OturumContext.jsx # Giriş yapan kullanıcı, token, otomatik çıkış
├── hooks/
│   └── useHashRota.js  # Basit sayfa yönlendirme (#/giris, #/panel ...)
├── pages/              # Sayfalar
│   ├── GirisSayfasi.jsx
│   ├── KayitSayfasi.jsx
│   ├── PanelSayfasi.jsx    # giriş yapmış herkes
│   ├── BelgelerSayfasi.jsx # yükleme + belgelerim (Hafta 6)
│   └── YoneticiSayfasi.jsx # sadece yönetici
└── components/         # Ekran parçaları (bileşenler)
    ├── Header.jsx      # Üst menü (giriş durumuna göre değişir)
    ├── HealthBadge.jsx # Backend bağlantı durumu rozeti
    ├── Hero.jsx        # Tanıtım bölümü
    ├── KorumaliSayfa.jsx # Giriş/yetki yoksa sayfayı göstermez
    ├── KorumaliGorsel.jsx # Token gerektiren görseli indirip gösterir
    ├── YuklemeAlani.jsx  # Sürükle-bırak / dosya seçme (tür, boyut ön kontrolü)
    ├── Karsilastirma.jsx # Orijinal ve ön işlenmiş görsel yan yana
    └── ModuleList.jsx  # Backend'den gelen modül listesi
```

## Sayfalar ve erişim

| Adres | Sayfa | Kim girebilir? |
|---|---|---|
| `#/` | Ana sayfa | Herkes |
| `#/giris`, `#/kayit` | Giriş / Kayıt | Herkes |
| `#/panel` | Panelim | Giriş yapmış herkes |
| `#/belgeler` | Belgelerim (yükleme) | Giriş yapmış herkes, sadece kendi belgeleri |
| `#/yonetici` | Yönetici paneli | Sadece yönetici (değilse 403 ekranı) |

Frontend'deki kontrol sadece görüntü içindir. Asıl yetki kontrolü backend'de yapılır.

Bileşenler backend'e doğrudan istek atmaz; `api/client.js` içindeki fonksiyonları kullanır.
Böylece backend adresi değişirse tek bir dosya değişir.

## Kurulum (Windows)

Gerekenler: **Node.js (LTS)** ve çalışan **belgematik-backend**.

```powershell
git clone https://github.com/hasankamiloglu/belgematik-frontend.git
cd belgematik-frontend
npm install
copy .env.example .env
npm run dev
```

Tarayıcıda aç: http://localhost:5173

Sağ üstte **"API bağlı"** yazıyorsa frontend backend'e ulaşabiliyor demektir.
**"API'ye ulaşılamadı"** yazıyorsa önce backend'i başlatın (`python run.py`).

## Komutlar

| Komut | Ne yapar? |
|---|---|
| `npm install` | `package.json`'daki kütüphaneleri `node_modules` klasörüne kurar |
| `npm run dev` | Geliştirme sunucusunu başlatır (kod değişince sayfa anında yenilenir) |
| `npm run build` | Canlıya alınacak, küçültülmüş sürümü `dist/` klasörüne üretir |

## Lisans

Bu proje Bilgisayar Uygulamaları I dersi kapsamında geliştirilmektedir.
