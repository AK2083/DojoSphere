import { useNamespaceToTranslate } from "@shared/hooks/usei18n";

export default function useTranslations() {
  const { translate } = useNamespaceToTranslate("shared");

  return {
    translations: {
      mail: translate("mail"),
      password: {
        label: translate("password.label"),
        toggle: translate("password.toggle"),
        hints: {
          common: translate("password.hints.common"),
          length: translate("password.hints.length"),
          uppercase: translate("password.hints.uppercase"),
          number: translate("password.hints.number"),
          special: translate("password.hints.special"),
        },
      },
      conjunction: translate("conjunction"),
      contain: translate("contain"),
    },
  };
}
