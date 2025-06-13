import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import blackLogo from "./talopakettiinlogovariants-black.png";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../context/languageContext";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { API_BASE_URL } from "../config/apiConfig";
import { DropdownMenu } from "../components/dropdownMenu";

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const isHome = location.pathname === "/";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigationGroups = {
    info: {
      title: t("navigation.info"),
      items: [
        { name: t("navigation.about"), path: "/about" },
        { name: t("navigation.contact"), path: "/contact" },
      ],
    },
  };

  return (
    <header
      className={
        isHome
          ? "bg-white/40 backdrop-blur-lg shadow-lg border border-white/30 transition-colors duration-300 w-full z-20 fixed"
          : "bg-white/40 backdrop-blur-lg shadow-lg border border-white/30 transition-colors duration-300 w-full z-20 fixed"
      }
    >
      <nav className="w-full px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and main navigation */}
          <div className="flex items-center space-x-4 md:space-x-12">
            {/* Logo */}
            <NavLink to="/" className="flex-shrink-0">
              <img
                src={blackLogo}
                alt={t("common.logoAlt")}
                className="w-24 md:w-32 h-auto object-contain hover:opacity-80 transition-opacity"
              />
            </NavLink>

            {/* Main Navigation - Desktop */}
            <ul className="hidden md:flex md:flex-wrap lg:flex-nowrap gap-x-4 gap-y-">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `flex items-center text-gray-900 drop-shadow hover:text-blue-600 text-lg font-medium transition-colors relative hover:bg-white/20 px-3 py-2 rounded-md ${
                      isActive
                        ? "text-blue-600 after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-0.5 after:bg-blue-600"
                        : ""
                    }`
                  }
                >
                  {t("navigation.home")}
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/blog"
                  className={({ isActive }) =>
                    `flex items-center text-gray-900 drop-shadow hover:text-blue-600 text-lg font-medium transition-colors relative hover:bg-white/20 px-3 py-2 rounded-md ${
                      isActive
                        ? "text-blue-600 after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-0.5 after:bg-blue-600"
                        : ""
                    }`
                  }
                >
                  {t("navigation.blog")}
                </NavLink>
              </li>
              {Object.entries(navigationGroups).map(([key, group]) => (
                <li key={key}>
                  <DropdownMenu items={group.items} title={group.title} />
                </li>
              ))}
            </ul>
          </div>

          {/* Right side - Language Switcher and Buttons */}
          <div className="flex items-center space-x-4 md:space-x-6">
            <LanguageSwitcher />
            <NavLink
              to="/signin"
              className="hidden md:inline-flex text-gray-900 drop-shadow hover:text-blue-600 text-lg font-medium transition-colors"
            >
              {t("common.signIn")}
            </NavLink>
            <NavLink
              to="/formpage"
              className="hidden md:inline-flex bg-blue-600 text-white text-lg font-medium px-4 py-2 rounded-md transition-colors hover:bg-blue-700"
            >
              {t("navigation.fillApplication")}
            </NavLink>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className={`${isMobileMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isMobileMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isMobileMenuOpen ? "block" : "hidden"} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium text-gray-900 drop-shadow ${
                  isActive
                    ? "text-blue-600 bg-blue-50"
                    : "hover:text-blue-600 hover:bg-white/20"
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("navigation.home")}
            </NavLink>
            {Object.entries(navigationGroups).map(([key, group]) => (
              <div key={key} className="space-y-1">
                <div className="px-3 py-2 text-base font-medium text-gray-500">
                  {group.title}
                </div>
                {group.items.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      `block pl-6 pr-3 py-2 rounded-md text-base font-medium text-gray-900 drop-shadow ${
                        isActive
                          ? "text-blue-600 bg-blue-50"
                          : "hover:text-blue-600 hover:bg-white/20"
                      }`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            ))}
            <NavLink
              to="/signin"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium text-gray-900 drop-shadow ${
                  isActive
                    ? "text-blue-600 bg-blue-50"
                    : "hover:text-blue-600 hover:bg-white/20"
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("common.signIn")}
            </NavLink>
            <NavLink
              to="/formpage"
              className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("navigation.fillApplication")}
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
};
