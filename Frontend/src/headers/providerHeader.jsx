import React from "react";
import { NavLink } from "react-router-dom";
import blackLogo from "./talopakettiinlogovariants-black.png";
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/languageContext';

export const ProviderHeader = ({ handleLogout }) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  const navigationItems = [
    { name: t('navigation.home'), path: "/" },
    { name: t('navigation.about'), path: "/about" },
    { name: t('navigation.contact'), path: "/contact" },
    { name: t('navigation.allApplications'), path: "/allapplications" },
  ];

  return (
    <header className="bg-white shadow-sm">
      <nav className="w-full pl-4 pr-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and main navigation */}
          <div className="flex items-center space-x-12">
            {/* Logo */}
            <NavLink to="/" className="flex-shrink-0">
              <img
                src={blackLogo}
                alt={t('common.logoAlt')}
                className="w-32 h-auto object-contain hover:opacity-80 transition-opacity"
              />
            </NavLink>

            {/* Main Navigation */}
            <ul className="hidden md:flex space-x-8">
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
          <div className="flex items-center space-x-6">
            <LanguageSwitcher />
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white text-lg font-medium px-4 py-2 rounded-md transition-colors hover:bg-red-600"
            >
              {t('common.logout')}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
