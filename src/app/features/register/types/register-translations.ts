import { Signal } from '@angular/core';

export type RegisterTranslations = {
  title: Signal<string>;
  subtitle: Signal<string>;
  mailLabel: Signal<string>;
  mailRequired: Signal<string>;
  mailWrong: Signal<string>;
  passwordLabel: Signal<string>;
  passwordRequired: Signal<string>;
  promptLabel: Signal<string>;
  simpleLabel: Signal<string>;
  mediumLabel: Signal<string>;
  strongLabel: Signal<string>;
  ucChars: Signal<string>;
  number: Signal<string>;
  specialChars: Signal<string>;
  minLength: Signal<string>;
  success: Signal<string>;
  failedRegistration: Signal<string>;
  confirmationButton: Signal<string>;
};
