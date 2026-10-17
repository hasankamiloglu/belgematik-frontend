// main.jsx - React uygulamasının BAŞLANGIÇ noktası.
// index.html içindeki <div id="root"> elemanını bulur ve App bileşenini içine çizer.

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { OturumSaglayici } from "./auth/OturumContext.jsx";
import "./styles.css";

// StrictMode -> geliştirme sırasında olası hataları erkenden uyaran React modu.
// Canlı (production) sürümde hiçbir etkisi yoktur.
// OturumSaglayici -> giriş yapan kullanıcı bilgisini tüm sayfalara dağıtır (Hafta 5).
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <OturumSaglayici>
      <App />
    </OturumSaglayici>
  </StrictMode>
);
