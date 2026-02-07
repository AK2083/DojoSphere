import { useTranslation } from "react-i18next";

export function useNamespaceToTranslate(namespace: string) {
  const { t } = useTranslation(namespace);

  return {
    translate: t,
  };
}

export function useSelectedTranslation() {
  const { i18n } = useTranslation();

  return {
    language: i18n.resolvedLanguage ?? i18n.language,
    changeLanguage: (lng: string) => i18n.changeLanguage(lng),
  };
}
