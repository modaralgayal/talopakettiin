import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaClipboardList, FaHandshake, FaClock } from "react-icons/fa";
import { ImageSlideshow } from "../components/ImageSlideshow";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../context/languageContext";
import { Helmet } from "react-helmet-async";
import Seo from "../seo/Seo";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import BlogSection from "../components/BlogSection";

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

  return (
    <div>
      <Seo
        title={`Talopakettiin - ${t("navigation.home")}`}
        description={t("navigation.homeDescription")}
        canonical="https://talopakettiin.fi/"
        schemaMarkup={jsonLd}
      />

      {/* Keywords Meta Tag (for other search engines) */}
      <Helmet>
        <meta
          name="keywords"
          content="talopaketti, talopaketit, omakotitalo, rakentaminen, talonrakentaminen, kilpailutus, vertailu, Talopakettiin, omakotitalon rakentaminen, omakotitalon hankinta, omakotitalon valinta, omakotitalon hankintaprosessi, omakotitalon hankintaprosessi, omakotitalon hankintaprosessi, omakotitalon hankintaprosessi, talopaketin kilpailuttaminen, talopaketin valinta, 
          talopaketin hankinta, talopaketin hankintaprosessi, talopaketin hankintaprosessi, talopaketin hankintaprosessi, talopaketin hankintaprosessi"
        />
      </Helmet>

      <div className="relative min-h-screen font-['Avenir']">
        {/* Slideshow background - fixed to cover the entire viewport */}
        <div className="fixed inset-0 w-full h-full z-0">
          <ImageSlideshow />
        </div>

        {/* Main content - positioned relative and above the slideshow */}
        <div className="relative z-10 pt-20">
          {/* Hero Section */}
          <div className="pt-32 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                  {t("homepage.hero.title")}
                </h1>
                <p className="text-2xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                  {t("homepage.hero.subtitle")}
                </p>
                <Link
                  to="/formpage"
                  className="inline-flex items-center px-12 py-6 border-2 border-transparent text-xl font-bold rounded-full shadow-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 tracking-wide transform hover:scale-105 hover:shadow-blue-500/25"
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
                <p className="mt-4 text-lg text-white/80 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                  {t("homepage.hero.subtext")}
                </p>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="py-16 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Glassmorphic banner for the title */}
              <div className="bg-white/10 backdrop-blur-lg py-6 mb-12 rounded-2xl shadow-lg border border-white/20">
                <h2 className="text-3xl font-bold text-center text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                  {t("homepage.features.title")}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-white/20 transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:bg-white/15 group"
                  >
                    <div className="mb-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3 tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] group-hover:text-blue-300 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-white/80 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Process Section */}
          <div className="w-full relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              {/* Glassmorphic banner for the title */}
              <div className="bg-white/10 backdrop-blur-lg py-6 mb-12 rounded-2xl shadow-lg border border-white/20">
                <h2 className="text-3xl font-bold text-center text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                  {t("homepage.process.title")}
                </h2>
              </div>
              <div className="relative">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/20 -translate-y-1/2 hidden lg:block" />
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
                    className="flex flex-col items-center text-center bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-white/20 transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:bg-white/15 relative group"
                  >
                    <div className="relative z-10 w-16 h-16 flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full text-2xl font-bold mb-6 shadow-lg group-hover:from-blue-500 group-hover:to-blue-600 transition-all duration-300">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3 tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] group-hover:text-blue-300 transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-white/80 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="w-full bg-white/10 backdrop-blur-lg py-16 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold mb-4 tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                {t("homepage.cta.title")}
              </h2>
              <p className="text-xl mb-8 leading-relaxed text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                {t("homepage.cta.subtitle")}
              </p>
              <Link
                to="/formpage"
                className="inline-flex items-center px-8 py-4 border-2 border-transparent text-lg font-medium rounded-full text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 tracking-wide shadow-lg hover:shadow-blue-500/25 hover:scale-105"
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
          <BlogSection />
        </div>
      </div>
    </div>
    </div>

  );
};

export default Homepage;
