export const STORAGE_KEYS = {
  DEFAULT_LANGUAGE: "defaultLanguage",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
