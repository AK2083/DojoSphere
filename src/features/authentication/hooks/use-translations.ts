import { useNamespaceToTranslate } from "@lib/i18n/use-namespace-to-translate";

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
        mail: {
          title: translate("form.mail.title"),
          invalid: translate("form.mail.invalid"),
        },
        password: {
          title: translate("form.password.title"),
          invalid: translate("form.password.invalid"),
          displayToggle: translate("form.password.displayToggle"),
        },
        submit: translate("form.submit"),
        error: {
          retry: translate("form.error.retry"),
          unknown: translate("form.error.unknown"),
        },
      },
      success: {
        title: translate("success.title"),
        description: translate("success.description"),
        resendMail: translate("success.resendMail"),
      },
    },
  };
}
