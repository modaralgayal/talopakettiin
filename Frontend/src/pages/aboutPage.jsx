import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "../context/languageContext";
import Seo from "../seo/Seo";

export const AboutPage = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    document.title = `Talopakettiin - ${t("navigation.about")}`;
  }, [t]);

  // JSON-LD structured data for About page
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "Talopakettiin - Tietoa sivusta",
    "description": "Talopakettiin on talopakettien kilpailutuspalvelu, joka yhdistää kotihankkijat ja luotettavat talotoimittajat. Autamme sinua löytämään unelmiesi talopaketin helposti ja läpinäkyvästi.",
    "url": "https://talopakettiin.fi/about",
    "mainEntity": {
      "@type": "Organization",
      "name": "Talopakettiin",
      "description": "Talopakettien kilpailutuspalvelu",
      "url": "https://talopakettiin.fi",
      "serviceType": "House Package Comparison Service"
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <Seo
        title="Tietoa sivusta - Talopakettiin"
        description="Talopakettiin on talopakettien kilpailutuspalvelu, joka yhdistää kotihankkijat ja luotettavat talotoimittajat. Autamme sinua löytämään unelmiesi talopaketin."
        canonical="https://talopakettiin.fi/about"
        schemaMarkup={jsonLd}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tietoa sivusta
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Talopakettiin on talopakettien kilpailutuspalvelu, joka yhdistää kotihankkijat ja luotettavat talotoimittajat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Mitä teemme?
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Autamme sinua löytämään unelmiesi talopaketin vertailemalla eri toimittajien tarjouksia. 
              Yksi hakemus riittää - me hoidamme loput puolestasi.
            </p>
            <ul className="text-gray-600 space-y-2">
              <li>• Talopakettien kilpailutus</li>
              <li>• Luotettavien toimittajien verkosto</li>
              <li>• Läpinäkyvä vertailu</li>
              <li>• Ilmainen palvelu</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Miksi Talopakettiin?
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Talopakettien hankinta voi olla monimutkaista. Me teemme siitä yksinkertaisempaa 
              ja läpinäkyvämpää.
            </p>
            <ul className="text-gray-600 space-y-2">
              <li>• Säästä aikaa ja vaivaa</li>
              <li>• Vertaa useita tarjouksia</li>
              <li>• Vain luotettavat toimittajat</li>
              <li>• Henkilökohtainen palvelu</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Miten se toimii?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Täytä hakemus</h3>
              <p className="text-gray-600">
                Kerro toiveistasi ja vaatimuksistasi unelmakotisi suhteen
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Saat tarjouksia</h3>
              <p className="text-gray-600">
                Talotoimittajat tutustuvat hakemukseesi ja tekevät sinulle tarjouksia
              </p>
            </div>
            <div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Valitse paras</h3>
              <p className="text-gray-600">
                Vertaile tarjouksia ja valitse sinulle sopivin vaihtoehto
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ota yhteyttä
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Onko sinulla kysymyksiä palvelustamme? Ota meihin yhteyttä, niin autamme sinua löytämään unelmiesi talopaketin.
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Ota yhteyttä
          </a>
        </div>
      </div>
    </div>
  );
};
