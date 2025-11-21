import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InterpolatableTranslationObject, TranslatePipe } from '@ngx-translate/core';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ThemeToggler } from '@core/service/theme/ThemeToggler';
import { Observable } from 'rxjs/internal/Observable';
import { LanguageSwitcher } from '@core/service/language/LanguageSwitcher';

@Component({
  selector: 'app-settings',
  imports: [FormsModule, TranslatePipe, NgClass, ToggleSwitchModule, SelectModule],
  templateUrl: './settings.html',
})
export class Settings {
  private languageSwitcher = inject(LanguageSwitcher);
  private themeToggler = inject(ThemeToggler);

  languages = this.languageSwitcher.availableLanguages;
  selectedLanguage = this.languageSwitcher.availableLanguages[0];

  isLightModeOn = false;

  switchLanguage = (): Observable<InterpolatableTranslationObject> =>
    this.languageSwitcher.switchLanguage(this.selectedLanguage);
  toggleDarkMode = (): void => this.themeToggler.toggleDarkMode();
}
