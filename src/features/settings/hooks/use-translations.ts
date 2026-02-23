import { useNamespaceToTranslate } from "@lib/i18n/use-namespace-to-translate";

export default function useTranslations() {
  const { translate } = useNamespaceToTranslate("settings");

  return {
    translations: {
      title: translate("title"),
      language: {
        title: translate("language.title"),
        description: translate("language.description"),
      },
      theme: {
        title: translate("theme.title"),
        description: translate("theme.description"),
        tooltip: {
          light: translate("theme.tooltip.light"),
          dark: translate("theme.tooltip.dark"),
          system: translate("theme.tooltip.system"),
        },
      },
    },
  };
}
