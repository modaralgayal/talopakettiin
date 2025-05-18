import React from 'react';
import { useLanguage } from '../context/languageContext';

const flagMap = {
  fi: "🇫🇮",
  sv: "🇸🇪",
  en: "🇬🇧"
};

const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();

  return (
    <select
      value={currentLanguage}
      onChange={e => changeLanguage(e.target.value)}
      className="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label="Select language"
    >
      {availableLanguages.map((lng) => (
        <option key={lng} value={lng}>
          {flagMap[lng] ? `${flagMap[lng]} ` : ""}{lng.toUpperCase()}
        </option>
      ))}
    </select>
  );
};

export default LanguageSwitcher; 