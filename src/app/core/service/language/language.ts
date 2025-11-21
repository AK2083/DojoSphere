import { inject, Injectable } from '@angular/core';
import { InterpolatableTranslationObject, TranslateService } from '@ngx-translate/core';
import { Language, Languages } from '@core/types/Languages';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private translate = inject(TranslateService);
  availableLanguages = Languages;

  constructor() {
    this.translate.addLangs(this.availableLanguages.map((item) => item.code));
    this.translate.setFallbackLang(this.availableLanguages[0].code);
    this.translate.use(this.availableLanguages[0].code);
  }

  switchLanguage = (language: Language): Observable<InterpolatableTranslationObject> =>
    this.translate.use(language.code);
}
