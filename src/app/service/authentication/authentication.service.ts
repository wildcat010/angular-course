import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../model/User';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {
  API_URL_LOGIN,
  API_URL_REGISTER,
  LOCAL_STORAGE_CURRENT_USER,
} from 'src/app/global/constants';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  currentUserSubject: BehaviorSubject<User>;

  constructor(
    private http: HttpClient,
    private localStorageBrowser: LocalStorageService
  ) {
    const currentUser = this.localStorageBrowser.getLanguageFromLocalStorage(
      LOCAL_STORAGE_CURRENT_USER
    );
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(currentUser)
    );
  }

  login(username: string, password: string): Observable<any> {
    return this.http
      .post<any>(API_URL_LOGIN, {
        email: username,
        password: password,
      })
      .pipe(
        map((userToken) => {
          const myUser = { email: username, token: userToken.token };

          this.localStorageBrowser.setLanguageFromLocalStorage(
            LOCAL_STORAGE_CURRENT_USER,
            JSON.stringify(myUser)
          );
          this.currentUserSubject.next(myUser);
          return myUser;
        })
      );
  }

  register(email: string, password: string): Observable<any> {
    return this.http
      .post<User>(API_URL_REGISTER, {
        email: email,
        password: password,
      })
      .pipe(
        map((user) => {
          const myUser = { email: email, token: user.token };
          this.localStorageBrowser.setLanguageFromLocalStorage(
            LOCAL_STORAGE_CURRENT_USER,
            JSON.stringify(myUser)
          );
          this.currentUserSubject.next(myUser);
          return myUser;
        })
      );
  }

  logout() {
    this.localStorageBrowser.removeFromLocalStorage(LOCAL_STORAGE_CURRENT_USER);
    this.currentUserSubject.next(null);
  }
}
