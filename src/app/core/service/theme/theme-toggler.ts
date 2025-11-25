import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeToggler {
  toggleDarkMode(): void {
    const element = document.querySelector('html');
    element?.classList.toggle('dark');
  }
}
