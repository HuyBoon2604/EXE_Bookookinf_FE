import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';


i18n
  .use(HttpApi) 
  .use(LanguageDetector) 
  .use(initReactI18next) 
  .init({
    fallbackLng: 'vi', 
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json', 
    },
    detection: {
      order: ['querystring', 'cookie'], 
      caches: ['cookie'], 
      checkWhitelist: true, 
    },
    
    react: {
      useSuspense: false, 
    },
  });

export default i18n;
