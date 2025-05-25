import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.darkModeSubject.asObservable();

  constructor() {
    // Check if user has a theme preference saved in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.darkModeSubject.next(savedTheme === 'dark');
    }
  }

  toggleDarkMode(): void {
    const newValue = !this.darkModeSubject.value;
    this.setDarkMode(newValue);
  }

  setDarkMode(isDark: boolean): void {
    this.darkModeSubject.next(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
}