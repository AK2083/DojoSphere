import { inject, Injectable, Signal } from '@angular/core';
import { TranslationWrapper } from '@core/service/language/TranslationWrapper';

import { SettingsTranslations } from '../types/SettingsTranslations';

@Injectable({
  providedIn: 'root',
})
export class Translation {
  private readonly translationWrapper = inject(TranslationWrapper);

  getTranslations(): SettingsTranslations {
    return {
      themeMode: this.getThemeMode(),
      language: this.getLanguage(),
    }
  }

  getThemeMode(): Signal<string> {
    return this.translationWrapper.t('feature.main.mode');
  }

  getLanguage(): Signal<string> {
    return this.translationWrapper.t('feature.main.language');
  }
}
