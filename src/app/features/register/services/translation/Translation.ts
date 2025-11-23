import { inject, Injectable, Signal } from '@angular/core';
import { TranslationWrapper } from '@core/service/language/TranslationWrapper';
import { RegisterTranslations } from '@features/register/types/RegisterTranslations';

@Injectable({
  providedIn: 'root',
})
export class Translation {
  private readonly translationWrapper = inject(TranslationWrapper);

  getTranslations(amount: number): RegisterTranslations {
    return {
      title: this.getTitle(),
      subtitle: this.getSubtitle(),
      mailLabel: this.getMailLabel(),
      mailRequired: this.getMailRequired(),
      mailWrong: this.getMailWrong(),
      passwordLabel: this.getPasswordLabel(),
      passwordRequired: this.getPasswordRequired(),
      promptLabel: this.getPromptLabel(),
      simpleLabel: this.getSimpleLabel(),
      mediumLabel: this.getMediumLabel(),
      strongLabel: this.getStrongLabel(),
      ucChars: this.getUpperCase(),
      number: this.getNumbers(),
      specialChars: this.getSpecialChars(),
      minLength: this.getMinLength(amount),
      confirmationButton: this.getConfirmation(),
    };
  }

  getTitle(): Signal<string> {
    return this.translationWrapper.t('feature.register.title');
  }

  getSubtitle(): Signal<string> {
    return this.translationWrapper.t('feature.register.subtitle');
  }

  //#region Email
  getMailLabel(): Signal<string> {
    return this.translationWrapper.t('feature.register.email.mailLabel');
  }

  getMailRequired(): Signal<string> {
    return this.translationWrapper.t('feature.register.email.error.required');
  }

  getMailWrong(): Signal<string> {
    return this.translationWrapper.t('feature.register.email.error.wrong');
  }
  //#endregion

  //#region Password
  getPasswordLabel(): Signal<string> {
    return this.translationWrapper.t('feature.register.password.pwdLabel');
  }

  getPasswordRequired(): Signal<string> {
    return this.translationWrapper.t('feature.register.password.error.required');
  }

  getPromptLabel(): Signal<string> {
    return this.translationWrapper.t('feature.register.password.feedbackLabels.choose');
  }

  getSimpleLabel(): Signal<string> {
    return this.translationWrapper.t('feature.register.password.feedbackLabels.simple');
  }

  getMediumLabel(): Signal<string> {
    return this.translationWrapper.t('feature.register.password.feedbackLabels.average');
  }

  getStrongLabel(): Signal<string> {
    return this.translationWrapper.t('feature.register.password.feedbackLabels.complex');
  }

  getUpperCase(): Signal<string> {
    return this.translationWrapper.t('feature.register.password.rules.ucChars');
  }

  getNumbers(): Signal<string> {
    return this.translationWrapper.t('feature.register.password.rules.number');
  }

  getSpecialChars(): Signal<string> {
    return this.translationWrapper.t('feature.register.password.rules.specialChars');
  }

  getMinLength(amount: number): Signal<string> {
    return this.translationWrapper.t('feature.register.password.rules.minLength', {
      pwdLength: amount,
    });
  }
  //#endregion

  getConfirmation(): Signal<string> {
    return this.translationWrapper.t('feature.register.confirmation');
  }
}
