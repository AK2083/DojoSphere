import { inject, Injectable, signal } from '@angular/core';
import { LocalStorage } from '@core/service/localStorage/local-storage';
import { AvailableThemes, ThemeStorageKey } from '@core/types/theme';
import { scopedLoggerFactory } from '@core/utils/scope.logger.factory';

@Injectable({
  providedIn: 'root',
})
export class ThemeToggler {
  private readonly logger = scopedLoggerFactory(ThemeToggler);
  private readonly localStorage = inject(LocalStorage);
  readonly currentTheme = signal(AvailableThemes.Light);
  readonly tailwindDarkThemeName = 'dark';

  isLightModeOn = (): boolean => 
    this.currentTheme() === AvailableThemes.Light;
  isSystemColorDark = (): boolean =>
    window.matchMedia(`(prefers-color-scheme: ${this.tailwindDarkThemeName})`).matches;
  isDarkInLocalStorage = (): boolean =>
    this.localStorage.getLocalStorage(ThemeStorageKey.Theme).item === AvailableThemes.Dark;
  isLocalStorageEmpty = (): boolean =>
    this.localStorage.getLocalStorage(ThemeStorageKey.Theme).item === null;

  toggleDarkMode(): void {
    if (this.isDarkInLocalStorage()) {
      this.localStorage.setLocalStorage(ThemeStorageKey.Theme, AvailableThemes.Light);
      this.applyThemeClass(false);
    } else {
      this.localStorage.setLocalStorage(ThemeStorageKey.Theme, AvailableThemes.Dark);
      this.applyThemeClass(true);
    }
  }

  loadDarkMode(): void {
    if (this.isDarkInLocalStorage()) {
      this.applyThemeClass(true);
    } else if (this.isLocalStorageEmpty()) {
      if (this.isSystemColorDark()) {
        this.applyThemeClass(true);
      } else {
        this.applyThemeClass(false);
      }
    } else {
      this.applyThemeClass(false);
    }
  }

  private applyThemeClass(isDark: boolean): void {
    if (isDark) {
      document.documentElement.classList.add(this.tailwindDarkThemeName);
      this.currentTheme.set(AvailableThemes.Dark);
    } else {
      document.documentElement.classList.remove(this.tailwindDarkThemeName);
      this.currentTheme.set(AvailableThemes.Light);
    }
  }
}
