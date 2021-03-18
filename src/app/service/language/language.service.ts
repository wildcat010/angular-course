import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  currentUserSubject: BehaviorSubject<string>;

  constructor() {
    let lang = this.getLanguageFromLocalStorage();
    this.currentUserSubject = new BehaviorSubject<string>(lang);
  }

  setLanguageFromLocalStorage(lang: string): void {
    localStorage.setItem('currentLangugage', lang);
  }

  getLanguageFromLocalStorage(): string {
    return localStorage.getItem('currentLangugage');
  }
}
