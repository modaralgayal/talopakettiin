import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from './translations/en.json';
import svTranslations from './translations/sv.json';
import fiTranslations from './translations/fi.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      sv: {
        translation: svTranslations
      },
      fi: {
        translation: fiTranslations
      }
    },
    lng: 'fi',
    fallbackLng: 'fi',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 