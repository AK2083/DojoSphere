import { useTranslation } from "react-i18next";

import type { LanguageCode } from "@lib/i18n/available-languages";

export function useNamespaceToTranslate(namespace: string) {
  const { t } = useTranslation(namespace);

  return {
    translate: t,
  };
}

export function useSelectedTranslation() {
  const { i18n } = useTranslation();

  const language = (i18n.resolvedLanguage ?? i18n.language) as LanguageCode;

  function changeLanguage(lng: LanguageCode) {
    return i18n.changeLanguage(lng);
  }

  return {
    language: language,
    changeLanguage: changeLanguage,
  };
}
