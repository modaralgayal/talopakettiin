import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import blackLogo from "./talopakettiinlogovariants-black.png";
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/languageContext';

export const ProviderHeader = ({ handleLogout }) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { name: t('navigation.home'), path: "/" },
    { name: t('navigation.about'), path: "/about" },
    { name: t('navigation.contact'), path: "/contact" },
    { name: t('navigation.allApplications'), path: "/allapplications" },
  ];

  return (
    <header className="bg-white/40 backdrop-blur-lg shadow-lg border border-white/30 transition-colors duration-300 w-full z-20 fixed">
      <nav className="w-full px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and main navigation */}
          <div className="flex items-center space-x-4 md:space-x-12">
            {/* Logo */}
            <NavLink to="/" className="flex-shrink-0">
              <img
                src={blackLogo}
                alt={t('common.logoAlt')}
                className="w-24 md:w-32 h-auto object-contain hover:opacity-80 transition-opacity"
              />
            </NavLink>

            {/* Main Navigation - Desktop */}
            <ul className="hidden md:flex md:flex-wrap lg:flex-nowrap gap-x-4 gap-y-2">
              {navigationItems.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `text-gray-700 hover:text-blue-600 text-lg font-medium transition-colors relative
                      ${isActive ? "text-blue-600 after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-0.5 after:bg-blue-600" : ""}`
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Right side - Language Switcher and Logout */}
          <div className="flex items-center space-x-4 md:space-x-6">
            <LanguageSwitcher />
            <button
              onClick={handleLogout}
              className="hidden md:inline-flex bg-red-500 text-white text-lg font-medium px-4 py-2 rounded-md transition-colors hover:bg-red-600"
            >
              {t('common.logout')}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigationItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </NavLink>
            ))}
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-red-500 hover:bg-red-600"
            >
              {t('common.logout')}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
