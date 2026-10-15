// vite.config.js - Vite (geliştirme sunucusu ve derleyici) ayarları.
//
// Vite nedir? React kodunu tarayıcının anlayacağı hale getiren ve
// geliştirme sırasında sayfayı anında yenileyen araç.

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // plugins: [react()] -> Vite'a JSX (HTML'e benzeyen React yazımı) desteği ekler.
  plugins: [react()],
  server: {
    // port: 5173 -> frontend http://localhost:5173 adresinde açılır.
    // Backend'in CORS izin listesinde bu adres olduğu için değiştirmiyoruz.
    port: 5173,
  },
});
