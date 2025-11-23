import { inject, Injectable, Signal } from '@angular/core';
import { TranslationWrapper } from '@core/service/language/TranslationWrapper';
import { SettingsTranslations } from '@core/types/SettingsTranslation';

@Injectable({
  providedIn: 'root',
})
export class Translation {
  private readonly translationWrapper = inject(TranslationWrapper);

  getTranslations(): SettingsTranslations {
    return {
      settingsLabel: this.getSettingsLabel(),
    };
  }

  getSettingsLabel(): Signal<string> {
    return this.translationWrapper.t('feature.main.settings');
  }
}
