import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./i18n"; // Import i18n configuration
import { BrowserRouter } from "react-router-dom"; // 👈 Import this!
import { FormProvider } from "./context/formContext.jsx";
import { OfferProvider } from "./context/offerContext.jsx";
import { LanguageProvider } from "./context/languageContext.jsx";
import { HelmetProvider } from "react-helmet-async";
import "./config/firebaseConfig.js"; // Firebase initialization

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <LanguageProvider>
          <FormProvider>
            <OfferProvider>
              <App />
            </OfferProvider>
          </FormProvider>
        </LanguageProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
