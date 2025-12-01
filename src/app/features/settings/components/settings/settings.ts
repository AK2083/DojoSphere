import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslationWrapper } from '@core/service/language/translation-wrapper';
import { ThemeToggler } from '@core/service/theme/theme-toggler';
import { TranslationManager } from '@features/settings/services/translation-manager';
import { InterpolatableTranslationObject } from '@ngx-translate/core';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-settings',
  imports: [FormsModule, NgClass, ToggleSwitchModule, SelectModule],
  templateUrl: './settings.html',
})
export class Settings {
  private readonly translationWrapper = inject(TranslationWrapper);
  private readonly themeToggler = inject(ThemeToggler);
  private readonly translation = inject(TranslationManager);

  readonly isLightModeOn = this.themeToggler.isLightModeOn;
  readonly translations = this.translation.getTranslations();
  readonly languages = this.translationWrapper.availableLanguages;
  readonly selectedLanguage = this.translationWrapper.getDefaultLanguage();

  switchLanguage = (): Observable<InterpolatableTranslationObject> =>
    this.translationWrapper.switchLanguage(this.selectedLanguage);
  toggleDarkMode = (): void => {
    this.themeToggler.toggleDarkMode();
  };
}
