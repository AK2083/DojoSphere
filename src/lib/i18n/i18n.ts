import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { AVAILABLE_LANGUAGES } from "@shared/constants/available-languages";

i18n.use(initReactI18next).init({
  supportedLngs: AVAILABLE_LANGUAGES.map((item) => item.code),
  fallbackLng: AVAILABLE_LANGUAGES[0].code,
  defaultNS: "common",
  interpolation: { escapeValue: false },
});

export default i18n;
