import { useTranslation } from "react-i18next";

export function useNamespaceToTranslate(namespace: string) {
  const { t } = useTranslation(namespace);

  return {
    translate: t,
  };
}
