import { inject, Injectable } from '@angular/core';
import { InterpolatableTranslationObject, TranslateService } from '@ngx-translate/core';
import { Language } from '@core/types/Language';
import { Observable } from 'rxjs/internal/Observable';
import { AVAILABLE_LANGUAGES } from '@core/data/availableLanguages';

@Injectable({
  providedIn: 'root',
})
export class LanguageSwitcher {
  private translate = inject(TranslateService);
  availableLanguages = AVAILABLE_LANGUAGES;

  constructor() {
    this.translate.addLangs(this.availableLanguages.map((item) => item.code));
    this.translate.setFallbackLang(this.availableLanguages[0].code);
    this.translate.use(this.availableLanguages[0].code);
  }

  switchLanguage = (language: Language): Observable<InterpolatableTranslationObject> =>
    this.translate.use(language.code);
}
