import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "../context/languageContext";
export const AboutPage = () => {
  const { t } = useTranslation();
  const currentLanguage = useLanguage();

  useEffect(() => {
    document.title = `Talopakettiin - ${t("navigation.about")}`;
  }, [t]);

  const teamMembers = [
    {
      name: "Mudar Algayal",
      role: "Technical Lead",
      description:
        "Opiskelija Helsingin yliopistossa ja tekninen johtaja Talopakettiin-projektissa. Erikoistunut ohjelmistokehitykseen ja teknisiin ratkaisuihin.",
      image: "https://placehold.co/400x400/e2e8f0/1e40af?text=Mudar",
    },
    {
      name: "Valtteri Nikkanen",
      role: "Valokuvaaja & Yrittäjä",
      description:
        "Ammattitaitoinen valokuvaaja ja yrittäjä, joka tuo visuaalista osaamista ja yrittäjähenkeä Talopakettiin-projektiin.",
      image: "https://placehold.co/400x400/e2e8f0/1e40af?text=Valtteri",
    },
    {
      name: "Robert Enroth",
      role: "Sähköasentaja & Yrittäjä",
      description:
        "Kokenut sähköasentaja ja yrittäjä, joka tuo laaja-alaisen rakennusalan osaamisen ja yrittäjähenkeä projektiimme.",
      image: "https://placehold.co/400x400/e2e8f0/1e40af?text=Robert",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <Helmet>
        <title>{`Talopakettiin - ${t("navigation.about")}`}</title>
        <meta
          name="description"
          content="Tutustu Talopakettiin-tiimiin! Olemme intohimoisia ammattilaisia, jotka yhdistävät teknologian, visuaalisuuden ja rakennusalan osaamisen luodaksemme parhaan palvelun talopakettien hankintaan."
        />
        <meta
          name="keywords"
          content="talopaketti tiimi, talopaketti ammattilaiset, talonrakentaminen asiantuntijat, talopaketti palvelu, talopaketti yritys, talopaketti suomi"
        />
        <meta name="author" content="Talopakettiin" />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:title"
          content={`Talopakettiin - ${t("navigation.about")}`}
        />
        <meta
          property="og:description"
          content="Tutustu Talopakettiin-tiimiin! Olemme intohimoisia ammattilaisia, jotka yhdistävät teknologian, visuaalisuuden ja rakennusalan osaamisen."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://talopakettiin.fi/about" />
        <meta
          property="og:image"
          content="https://talopakettiin.fi/about-og-image.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`Talopakettiin - ${t("navigation.about")}`}
        />
        <meta
          name="twitter:description"
          content="Tutustu Talopakettiin-tiimiin! Olemme intohimoisia ammattilaisia, jotka yhdistävät teknologian, visuaalisuuden ja rakennusalan osaamisen."
        />
        <link rel="canonical" href="https://talopakettiin.fi/about" />
        <html lang={currentLanguage} />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tietoa meistä
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Olemme intohimoisia ammattilaisia, jotka yhdistävät teknologian,
            visuaalisuuden ja rakennusalan osaamisen luodaksemme parhaan
            palvelun talopakettien hankintaan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              <div className="aspect-w-1 aspect-h-1">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 leading-relaxed">
                  {member.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Yhteinen visio
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Haluamme tehdä talopakettien hankinnasta helpompaa ja
            läpinäkyvämpää. Yhdistämällä teknologian, visuaalisuuden ja
            rakennusalan osaamisen, autamme asiakkaitamme löytämään
            unelmakotinsa.
          </p>
        </div>
      </div>
    </div>
  );
};
