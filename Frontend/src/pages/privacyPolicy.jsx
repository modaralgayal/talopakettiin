import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

export const PrivacyPolicy = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const privacyPolicyContent = {
    fi: {
      title: "Tietosuojakäytäntö",
      lastUpdated: "Päivitetty viimeksi: 19.3.2024",
      sections: [
        {
          title: "1. Tietojen kerääminen",
          content: `Keräämme seuraavat henkilökohtaiset tiedot:
          - Sähköpostiosoite
          - Puhelinnumero
          - Koko nimi
          - Talopaketin rakennustiedot (kodin rakentamiseen liittyvät yksityiskohtaiset tiedot)
          
          Emme kerää tai tallenna salasanoja tai luottokorttitietoja.`
        },
        {
          title: "2. Tietojen käyttötarkoitus",
          content: `Keräämme tietoja seuraaviin tarkoituksiin:
          - Talopaketin tarjousten tekeminen ja hallinta
          - Asiakaspalvelu ja viestintä
          - Hakemusten ja tarjousten käsittely
          - Palvelun kehittäminen
          
          Tietoja käytetään vain ilmoitettuihin tarkoituksiin ja niiden käsittely perustuu EU:n tietosuoja-asetukseen (GDPR).`
        },
        {
          title: "3. Tietojen säilytys",
          content: `Henkilökohtaiset tiedot säilytetään vain niin kauan kuin on tarpeen palvelun tarjoamiseen ja lakisääteisten velvoitteiden täyttämiseen. Voit pyytää tietojesi poistamista milloin tahansa.`
        },
        {
          title: "4. Tietojen jakaminen",
          content: `Tietoja jaetaan vain:
          - Rakennusyrityksille, jotka tekevät tarjouksia talopaketistasi
          - Lakisääteisten velvoitteiden täyttämiseksi
          
          Emme myy tai vuokraa henkilökohtaisia tietoja kolmansille osapuolille.`
        },
        {
          title: "5. Oikeutesi",
          content: `Sinulla on oikeus:
          - Saada pääsy omiin tietoihisi
          - Pyytää tietojesi korjaamista
          - Pyytää tietojesi poistamista
          - Vastustaa tietojesi käsittelyä
          - Siirtää tietosi toiselle palveluntarjoajalle
          
          Voit käyttää oikeuksiasi ottamalla yhteyttä osoitteeseen: info@talopakettiin.fi`
        },
        {
          title: "6. Evästeet",
          content: `Käytämme evästeitä palvelun toiminnan varmistamiseen ja käyttökokemuksen parantamiseen. Voit hallita evästeiden käyttöä selaimen asetuksista.`
        },
        {
          title: "7. Tietoturva",
          content: `Suojaamme tietojasi teknisillä ja organisatorisilla toimenpiteillä. Tiedot siirretään salatusti ja säilytetään turvallisesti.`
        },
        {
          title: "8. Yhteystiedot",
          content: `Tietosuojaan liittyvissä kysymyksissä voit ottaa yhteyttä:
          Talopakettiin
          info@talopakettiin.fi
          
          Voit myös ottaa yhteyttä tietosuojavaltuutettuun: tietosuoja.fi`
        }
      ]
    },
    en: {
      title: "Privacy Policy",
      lastUpdated: "Last updated: March 19, 2024",
      sections: [
        {
          title: "1. Data Collection",
          content: `We collect the following personal information:
          - Email address
          - Phone number
          - Full name
          - House package construction data (detailed information about the house you want to build)
          
          We do not collect or store passwords or credit card information.`
        },
        {
          title: "2. Purpose of Data Processing",
          content: `We collect data for the following purposes:
          - Making and managing house package offers
          - Customer service and communication
          - Processing applications and offers
          - Service development
          
          Data is used only for the stated purposes and processing is based on the EU General Data Protection Regulation (GDPR).`
        },
        {
          title: "3. Data Retention",
          content: `Personal data is retained only for as long as necessary to provide the service and fulfill legal obligations. You can request deletion of your data at any time.`
        },
        {
          title: "4. Data Sharing",
          content: `Data is shared only with:
          - Construction companies making offers for your house package
          - To fulfill legal obligations
          
          We do not sell or rent personal information to third parties.`
        },
        {
          title: "5. Your Rights",
          content: `You have the right to:
          - Access your personal data
          - Request correction of your data
          - Request deletion of your data
          - Object to processing of your data
          - Transfer your data to another service provider
          
          You can exercise your rights by contacting: info@talopakettiin.fi`
        },
        {
          title: "6. Cookies",
          content: `We use cookies to ensure the functionality of the service and improve user experience. You can manage cookie settings in your browser.`
        },
        {
          title: "7. Data Security",
          content: `We protect your data with technical and organizational measures. Data is transmitted encrypted and stored securely.`
        },
        {
          title: "8. Contact Information",
          content: `For privacy-related questions, you can contact:
          Talopakettiin
          info@talopakettiin.fi
          
          You can also contact the Data Protection Ombudsman: tietosuoja.fi`
        }
      ]
    }
  };

  const content = privacyPolicyContent[currentLanguage] || privacyPolicyContent.en;

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <Helmet>
        <title>{`Talopakettiin - ${content.title}`}</title>
        <meta name="description" content={content.title} />
        <link rel="canonical" href="/privacy-policy" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{content.title}</h1>
          <p className="text-gray-600 mb-8">{content.lastUpdated}</p>

          <div className="space-y-8">
            {content.sections.map((section, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{section.title}</h2>
                <div className="prose prose-blue max-w-none">
                  {section.content.split('\n').map((paragraph, pIndex) => (
                    <p key={pIndex} className="text-gray-700 mb-4 whitespace-pre-line">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 