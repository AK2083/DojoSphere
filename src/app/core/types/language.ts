import { APPNAME } from '@core/types/core';

export type Language = {
  name: string;
  code: string;
};

export enum AvailableLanguages {
  English = 'en',
  German = 'de',
}

export enum TranslationStorageKey {
  Language = `${APPNAME}_V1_Language`,
}
