import { inject, Injectable } from '@angular/core';
import { AVAILABLE_LANGUAGES } from '@core/data/availableLanguages';
import { Language } from '@core/types/Language';
import { InterpolatableTranslationObject, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/internal/Observable';

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
