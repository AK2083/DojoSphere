export const AVAILABLE_LANGUAGES = [
  { code: "de", name: "Deutsch" },
  { code: "en", name: "English" },
] as const;

export type LanguageCode = (typeof AVAILABLE_LANGUAGES)[number]["code"];

export const languageOptions = AVAILABLE_LANGUAGES.map((lang) => ({
  value: lang.code,
  label: lang.name,
}));
