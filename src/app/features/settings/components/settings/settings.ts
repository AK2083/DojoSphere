import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InterpolatableTranslationObject, TranslatePipe } from '@ngx-translate/core';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { LanguageService } from '@core/service/language/language';
import { ThemeService } from '@core/service/theme/theme';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-settings',
  imports: [FormsModule, TranslatePipe, NgClass, ToggleSwitchModule, SelectModule],
  templateUrl: './settings.html',
})
export class Settings {
  private languageService = inject(LanguageService);
  private themeService = inject(ThemeService);

  languages = this.languageService.availableLanguages;
  selectedLanguage = this.languageService.availableLanguages[0];

  isLightModeOn = false;

  switchLanguage = (): Observable<InterpolatableTranslationObject> =>
    this.languageService.switchLanguage(this.selectedLanguage);
  toggleDarkMode = (): void => this.themeService.toggleDarkMode();
}
