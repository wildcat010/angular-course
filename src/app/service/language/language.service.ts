import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LOCAL_STORAGE_LANGUAGE } from 'src/app/global/constants';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  currentUserSubject: BehaviorSubject<string>;

  constructor(private storage: LocalStorageService) {
    const lang = this.storage.getLanguageFromLocalStorage(
      LOCAL_STORAGE_LANGUAGE
    );
    this.currentUserSubject = new BehaviorSubject<string>(lang);
  }
}
