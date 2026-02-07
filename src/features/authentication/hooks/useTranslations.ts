import { useNamespaceToTranslate } from "@shared/hooks/usei18n";

export default function useTranslations() {
  const { translate } = useNamespaceToTranslate("authentication");

  return {
    translations: {
      useWithoutAuth: translate("title"),
      form: {
        title: translate("form.title"),
        description: translate("form.description"),
        alreadyAccount: translate("form.alreadyAccount"),
        logMeIn: translate("form.logMeIn"),
        submit: translate("form.submit"),
        error: {
          retry: translate("form.error.retry"),
          unknown: translate("form.error.unknown"),
        },
      },
    },
  };
}
