import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language, Languages } from '../../types/Languages';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private translate = inject(TranslateService);
  availableLanguages = Languages;

  constructor() {
    this.translate.addLangs(
      this.availableLanguages.map(item => item.code)
    );
    this.translate.setFallbackLang(
      this.availableLanguages[0].code
    );
    this.translate.use(
      this.availableLanguages[0].code
    );
  }

  public switchLanguage(language: Language) {
    this.translate.use(language.code);
  }
}
