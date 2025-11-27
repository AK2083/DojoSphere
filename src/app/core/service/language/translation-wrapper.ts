import { inject, Injectable, runInInjectionContext, Injector, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AVAILABLE_LANGUAGES } from '@core/data/availableLanguages';
import { Language } from '@core/types/language';
import { InterpolatableTranslationObject, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/internal/Observable';

/**
 * A wrapper service around `@ngx-translate/core`'s `TranslateService` that
 * provides typed translation helpers and reactive (Signal-based) translation access.
 * Includes logging and injector-context-aware signal creation.
 *
 * @providedIn root - This service is globally available in the Angular DI system.
 */
@Injectable({
  providedIn: 'root',
})
export class TranslationWrapper {
  private readonly translate = inject(TranslateService);
  private readonly injector = inject(Injector);

  availableLanguages = AVAILABLE_LANGUAGES;

  constructor() {
    this.translate.addLangs(this.availableLanguages.map((item) => item.code));
    this.translate.setFallbackLang(this.getDefaultLanguage().code);
    this.switchLanguage(this.getDefaultLanguage());
  }

  /**
   * Sets the current language of the application.
   *
   * @param language - Language code (e.g., `'en'`, `'de'`)
   */
  switchLanguage = (language: Language): Observable<InterpolatableTranslationObject> =>
    this.translate.use(language.code);

  /**
   * Gets the default fallback language of the application.
   *
   * @returns The default language code.
   */
  getDefaultLanguage = (): Language => this.availableLanguages[0];

  /**
   * Returns a reactive translation signal for a given translation key and optional parameters.
   * This allows automatic updates when the language changes.
   *
   * @param key - Translation key (e.g., `'home.title'`)
   * @param params - Optional interpolation parameters
   * @returns A Signal that emits the translated string.
   */
  t(key: string, params?: Record<string, number | string>): Signal<string> {
    return runInInjectionContext(this.injector, () => {
      return toSignal(this.translate.stream(key, params), {
        initialValue: this.translate.instant(key, params),
      });
    });
  }
}
