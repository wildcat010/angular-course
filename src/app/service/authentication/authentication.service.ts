import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../model/User';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private currentUserSubject: User;
  currentUser: string;

  isLogged = false;

  constructor(private http: HttpClient) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  login(username: string, password: string): Observable<any> {
    return this.http
      .post<any>('https://reqres.in/api/login', {
        email: username,
        password: password,
      })
      .pipe(
        map((userToken) => {
          console.log(userToken);
          const myUser = { email: username, token: userToken };
          localStorage.setItem('currentUser', JSON.stringify(myUser));
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }
}
