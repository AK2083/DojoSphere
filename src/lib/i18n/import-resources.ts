import i18n from "i18next";

import deApp from "@app/translations/de.json";
import enApp from "@app/translations/en.json";
import deAuth from "@features/authentication/translations/de.json";
import enAuth from "@features/authentication/translations/en.json";
import deSettings from "@features/settings/translations/de.json";
import enSettings from "@features/settings/translations/en.json";

i18n.addResourceBundle("de", "app", deApp);
i18n.addResourceBundle("en", "app", enApp);

i18n.addResourceBundle("de", "authentication", deAuth);
i18n.addResourceBundle("en", "authentication", enAuth);

i18n.addResourceBundle("de", "settings", deSettings);
i18n.addResourceBundle("en", "settings", enSettings);

export default i18n;
