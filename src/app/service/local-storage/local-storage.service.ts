import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  setLanguageFromLocalStorage(label: string, obj: string): void {
    localStorage.setItem(label, obj);
  }

  getLanguageFromLocalStorage(label: string): string {
    return localStorage.getItem(label);
  }

  removeFromLocalStorage(label: string) {
    localStorage.removeItem(label);
  }
}
