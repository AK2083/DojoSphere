import { useNamespaceToTranslate } from "@shared/hooks/use-i18n";

export default function useTranslations() {
  const { translate } = useNamespaceToTranslate("shared");

  return {
    translations: {},
  };
}
