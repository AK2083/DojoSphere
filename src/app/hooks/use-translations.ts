import { useNamespaceToTranslate } from "@lib/i18n/use-namespace-to-translate";

export default function useTranslations() {
  const { translate } = useNamespaceToTranslate("app");

  return {
    translations: {
      navigation: {
        title: translate("navigation.title"),
        open: translate("navigation.openMenu"),
        menuTitle: translate("navigation.menuTitle"),
        dashboard: translate("navigation.dashboard"),
      },
    },
  };
}
