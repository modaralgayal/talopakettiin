import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaClipboardList, FaHandshake, FaClock } from "react-icons/fa";
import { ImageSlideshow } from "../components/ImageSlideshow";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../context/languageContext";
import { Helmet } from "react-helmet-async";
import Seo from "../seo/Seo";

export const Homepage = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  // JSON-LD structured data for Homepage
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "Talopakettiin",
        url: "https://talopakettiin.fi",
        logo: "https://talopakettiin.fi/logo.png", // Replace with actual logo URL
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+358-123-4567", // Replace with actual phone number if available
          contactType: "customer service",
          email: "info@talopakettiin.fi",
        },
        sameAs: [],
      },
      {
        "@type": "WebSite",
        url: "https://talopakettiin.fi",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://talopakettiin.fi/search?q={search_term_string}", // Replace with actual search page URL if available
          queryInput: "required name=search_term_string",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Etusivu",
            item: "https://talopakettiin.fi",
          },
        ],
      },
      {
        "@type": "LocalBusiness",
        name: "Talopakettiin",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Your Street Address", // Replace with actual address if applicable
          addressLocality: "Your City",
          addressRegion: "Your Region",
          postalCode: "Your Postal Code",
          addressCountry: "FI",
        },
        telephone: "+358-123-4567", // Replace with actual phone number if available
        email: "info@talopakettiin.fi",
        url: "https://talopakettiin.fi",
        image: "https://talopakettiin.fi/logo.png", // Replace with actual image URL
        priceRange: "$$", // Replace with actual price range if applicable
        servesCuisine: "House Packages", // Replace with relevant category
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "09:00", // Replace with actual opening hours if applicable
            closes: "17:00",
          },
        ],
      },
      {
        "@type": "Service",
        name: "Talopakettien Kilpailutus",
        description:
          "Autamme sinua kilpailuttamaan talopaketteja ja löytämään parhaan ratkaisun unelmiesi kotiin.",
        provider: {
          "@type": "Organization",
          name: "Talopakettiin",
        },
      },
    ],
  };

  // Force Helmet update on mount
  useEffect(() => {
    document.title = `Talopakettiin - ${t("navigation.home")}`;
  }, [t]);

  // Function to format date based on current language
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      currentLanguage === "fi" ? "fi-FI" : currentLanguage
    );
  };

  const features = [
    {
      icon: <FaHome className="w-8 h-8 text-blue-500" />,
      title: t("homepage.features.dreamHome.title"),
      description: t("homepage.features.dreamHome.description"),
    },
    {
      icon: <FaClipboardList className="w-8 h-8 text-blue-500" />,
      title: t("homepage.features.easyProcess.title"),
      description: t("homepage.features.easyProcess.description"),
    },
    {
      icon: <FaHandshake className="w-8 h-8 text-blue-500" />,
      title: t("homepage.features.reliablePartners.title"),
      description: t("homepage.features.reliablePartners.description"),
    },
    {
      icon: <FaClock className="w-8 h-8 text-blue-500" />,
      title: t("homepage.features.saveTime.title"),
      description: t("homepage.features.saveTime.description"),
    },
  ];

  // Blog posts data with translations based on language
  const blogPosts = [
    {
      title:
        currentLanguage === "fi"
          ? "Talopaketin valinta: Näin löydät parhaan vaihtoehdon"
          : currentLanguage === "sv"
          ? "Val av huspaket: Så hittar du det bästa alternativet"
          : "House Package Selection: How to Find the Best Option",
      excerpt:
        currentLanguage === "fi"
          ? "Opi valitsemaan oikea talopaketti tarpeisiisi sopivaksi. Käymme läpi tärkeimmät huomioitavat asiat."
          : currentLanguage === "sv"
          ? "Lär dig välja rätt huspaket för dina behov. Vi går igenom de viktigaste sakerna att tänka på."
          : "Learn how to choose the right house package for your needs. We'll go through the most important things to consider.",
      date: "2024-03-15",
      image: "https://placehold.co/600x400/e2e8f0/1e40af?text=Talopaketti",
    },
    {
      title:
        currentLanguage === "fi"
          ? "Energiatehokkuus uudessa kodissa"
          : currentLanguage === "sv"
          ? "Energieffektivitet i det nya hemmet"
          : "Energy Efficiency in Your New Home",
      excerpt:
        currentLanguage === "fi"
          ? "Miten energiatehokkuus vaikuttaa talopaketin valintaan? Käymme läpi nykyaikaiset ratkaisut."
          : currentLanguage === "sv"
          ? "Hur påverkar energieffektivitet valet av huspaket? Vi går igenom moderna lösningar."
          : "How does energy efficiency affect house package selection? We'll go through modern solutions.",
      date: "2024-03-10",
      image: "https://placehold.co/600x400/e2e8f0/1e40af?text=Energia",
    },
    {
      title: "Rahoitusvaihtoehdot talopaketille",
      excerpt:
        "Tutustu erilaisiin rahoitusvaihtoehtoihin ja löydä sinulle sopivin ratkaisu.",
      date: "2024-03-05",
      image: "https://placehold.co/600x400/e2e8f0/1e40af?text=Rahoitus",
    },
    {
      title: "Sisustussuunnittelu uuteen kotiin",
      excerpt:
        "Vinkkejä sisustussuunnitteluun ja sisätilojen toteutukseen uudessa kodissa.",
      date: "2024-03-01",
      image: "https://placehold.co/600x400/e2e8f0/1e40af?text=Sisustus",
    },
    {
      title: "Ympäristöystävällinen rakentaminen",
      excerpt:
        "Miten rakentaa ympäristöystävällisesti? Käymme läpi kestävän kehityksen periaatteet.",
      date: "2024-02-25",
      image: "https://placehold.co/600x400/e2e8f0/1e40af?text=Ympäristö",
    },
    {
      title: "Talopaketin hankintaprosessi",
      excerpt:
        "Vaihe vaiheelta opas talopaketin hankintaprosessiin ja tärkeimmät huomioitavat asiat.",
      date: "2024-02-20",
      image: "https://placehold.co/600x400/e2e8f0/1e40af?text=Prosessi",
    },
  ];

  // Sort posts by date (newest first) and limit to 6
  const sortedAndLimitedPosts = [...blogPosts]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  return (
    <>
      <Seo
        title={`Talopakettiin - ${t("navigation.home")}`}
        description={t("navigation.homeDescription")}
        canonical="https://talopakettiin.fi/"
        schemaMarkup={jsonLd}
      />

      <div className="min-h-screen font-['Avenir']">
        {/* Hero + Cards with Slideshow background */}
        <div className="relative w-full flex flex-col justify-center">
          <div className="absolute inset-0 w-full h-full z-0">
            <ImageSlideshow />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/10" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
            {/* Hero Content */}
            <div className="text-center mb-75">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
                {t("homepage.hero.title")}
              </h1>
              <p className="text-2xl text-white max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-lg">
                {t("homepage.hero.subtitle")}
              </p>
              <Link
                to="/formpage"
                className="inline-flex items-center px-12 py-6 border-2 border-transparent text-xl font-bold rounded-full shadow-xl text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 tracking-wide transform hover:scale-105"
              >
                {t("homepage.hero.cta")}
                <svg
                  className="ml-3 -mr-1 w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <p className="mt-4 text-lg text-white/90">
                {t("homepage.hero.subtext")}
              </p>
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-blue-500 hover:border-2 cursor-pointer group"
                >
                  <div className="mb-4 text-blue-500 group-hover:text-blue-700 transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 tracking-tight group-hover:text-blue-700 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Process Section with solid background */}
        <div className="bg-blue-50 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 tracking-tight">
              {t("homepage.process.title")}
            </h2>
            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-blue-200 -translate-y-1/2 hidden lg:block" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {[
                  {
                    number: "1",
                    title: t("homepage.process.steps.apply.title"),
                    description: t("homepage.process.steps.apply.description"),
                  },
                  {
                    number: "2",
                    title: t("homepage.process.steps.offers.title"),
                    description: t("homepage.process.steps.offers.description"),
                  },
                  {
                    number: "3",
                    title: t("homepage.process.steps.choose.title"),
                    description: t("homepage.process.steps.choose.description"),
                  },
                ].map((step, index) => (
                  <div
                    key={index}
                    className="relative flex justify-center items-start"
                  >
                    <div className="bg-white aspect-square w-full rounded-xl shadow-md transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-blue-500 hover:border-2 cursor-pointer group flex flex-col items-center pt-10 pb-6 px-6">
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg transition-all duration-300 group-hover:bg-blue-700 z-10">
                        {step.number}
                      </div>
                      <h3 className="text-4xl font-semibold text-gray-900 mb-2 mt-6 tracking-tight group-hover:text-blue-700 transition-colors duration-300 text-center">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-2xl text-center">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">
              {t("homepage.cta.title")}
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              {t("homepage.cta.subtitle")}
            </p>
            <Link
              to="/formpage"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-full text-white hover:bg-white hover:text-blue-600 transition-colors duration-200 tracking-wide"
            >
              {t("homepage.cta.button")}
              <svg
                className="ml-2 -mr-1 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Blog Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 tracking-tight">
              {t("homepage.blog.title")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedAndLimitedPosts.map((post, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105"
                >
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-blue-600 mb-2">
                      {formatDate(post.date)}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <button className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
                      {t("homepage.blog.readMore")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Homepage;
