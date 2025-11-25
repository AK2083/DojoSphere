import { Signal } from '@angular/core';

export type SettingsTranslations = {
  settingsLabel: Signal<string>;
  themeMode: Signal<string>;
  language: Signal<string>;
};
