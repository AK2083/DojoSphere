import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { AVAILABLE_LANGUAGES } from "@lib/i18n/available-languages";
import { getInitialLanguage, normalizeLanguageEntry } from "@lib/i18n/default-language";

const initLanguage = getInitialLanguage();

i18n.use(initReactI18next).init({
  lng: initLanguage,
  supportedLngs: AVAILABLE_LANGUAGES.map((item) => item.code),
  fallbackLng: AVAILABLE_LANGUAGES[0].code,
  defaultNS: "common",
  interpolation: { escapeValue: false },
});

normalizeLanguageEntry(initLanguage);

export default i18n;
