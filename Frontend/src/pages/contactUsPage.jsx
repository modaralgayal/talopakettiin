import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { FaEnvelope } from "react-icons/fa";
import Seo from "../seo/Seo";

export const ContactUsPage = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `Talopakettiin - ${t("navigation.contact")}`;
  }, [t]);

  // JSON-LD structured data for Contact page
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Talopakettiin - Yhteystiedot",
    "description": "Ota yhteyttä Talopakettiin-asiakaspalveluun ja tiimiimme! Autamme sinua kaikissa talopaketteihin liittyvissä kysymyksissä ja unelmiesi kodin löytämisessä. Lähetä sähköpostia tai täytä yhteydenottolomake.",
    "url": "https://talopakettiin.fi/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "Talopakettiin",
      "email": "info@talopakettiin.fi",
      "url": "https://talopakettiin.fi",
      "description": "Talopakettien kilpailutuspalvelu"
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <Seo
        title="Yhteystiedot - Talopakettiin"
        description="Ota yhteyttä Talopakettiin-asiakaspalveluun ja tiimiimme! Autamme sinua kaikissa talopaketteihin liittyvissä kysymyksissä ja unelmiesi kodin löytämisessä. Lähetä sähköpostia tai täytä yhteydenottolomake."
        canonical="https://talopakettiin.fi/contact"
        schemaMarkup={jsonLd}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Yhteystiedot</h1>
          <p className="text-xl text-gray-600">
            Ota meihin yhteyttä, niin autamme sinua löytämään unelmiesi talopaketin.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <FaEnvelope className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sähköposti</h2>
            <a 
              href="mailto:info@talopakettiin.fi" 
              className="text-xl text-blue-600 hover:text-blue-800 transition-colors"
            >
              info@talopakettiin.fi
            </a>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Lisätietoa meistä löydät <a href="/about" className="text-blue-600 hover:underline">Tietoa meistä -sivultamme</a>.
          </p>
        </div>
      </div>
    </div>
  );
};
