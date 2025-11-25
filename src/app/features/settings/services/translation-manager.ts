import { inject, Injectable, Signal } from '@angular/core';
import { TranslationWrapper } from '@core/service/language/translation-wrapper';

import { SettingsTranslations } from '../types/settings-translations';

@Injectable({
  providedIn: 'root',
})
export class TranslationManager {
  private readonly translationWrapper = inject(TranslationWrapper);

  getTranslations(): SettingsTranslations {
    return {
      settingsLabel: this.getSettingsLabel(),
      themeMode: this.getThemeMode(),
      language: this.getLanguage(),
    };
  }

  getSettingsLabel(): Signal<string> {
    return this.translationWrapper.t('feature.main.settings');
  }

  getThemeMode(): Signal<string> {
    return this.translationWrapper.t('feature.main.mode');
  }

  getLanguage(): Signal<string> {
    return this.translationWrapper.t('feature.main.language');
  }
}
