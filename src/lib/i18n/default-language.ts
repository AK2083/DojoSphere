import { AVAILABLE_LANGUAGES, type LanguageCode } from "@lib/i18n/available-languages";
import { STORAGE_KEYS } from "@shared/constants/storage-keys";
import { getLocalStorageItem, setLocalStorageItem } from "@shared/lib/local-storage";

function isLanguageCode(value: string): value is LanguageCode {
  return AVAILABLE_LANGUAGES.some((l) => l.code === value);
}

function getSavedLanguage() {
  const savedLanguage = getLocalStorageItem(STORAGE_KEYS.DEFAULT_LANGUAGE);

  if (savedLanguage && isLanguageCode(savedLanguage)) {
    return savedLanguage;
  }

  return null;
}

function getBrowserLanguage() {
  if (typeof navigator === "undefined") {
    return null;
  }

  const browserLanguage = navigator.language.split("-")[0];

  if (isLanguageCode(browserLanguage)) {
    return browserLanguage;
  }

  return null;
}

export function getInitialLanguage(): LanguageCode {
  const saved = getSavedLanguage();
  if (saved) return saved;

  const browserLanguage = getBrowserLanguage();
  if (browserLanguage) {
    return browserLanguage;
  }

  return AVAILABLE_LANGUAGES[0].code;
}

export function normalizeLanguageEntry(initialLanguage: LanguageCode) {
  const savedLanguage = getLocalStorageItem(STORAGE_KEYS.DEFAULT_LANGUAGE);

  if (savedLanguage !== initialLanguage) {
    setLocalStorageItem(STORAGE_KEYS.DEFAULT_LANGUAGE, initialLanguage);
  }
}
