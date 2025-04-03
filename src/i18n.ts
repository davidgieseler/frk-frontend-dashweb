import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationEn from "./locales/en/translation.json";
import translationPt from "./locales/pt/translation.json";

const resources = {
  en: { translation: translationEn },
  pt: { translation: translationPt },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "pt",
    supportedLngs: ["en", "pt"],
    nonExplicitSupportedLngs: true,
    debug: true,
    load: "languageOnly",
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "preferredLanguage",
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
    initAsync: false,
  })
  .then(() => console.log("i18next initialized successfully"))
  .catch((error) => console.error("i18next initialization failed:", error));

export default i18n;
