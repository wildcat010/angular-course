import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../model/User';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  currentUserSubject: BehaviorSubject<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
  }

  login(username: string, password: string): Observable<any> {
    const url = 'https://reqres.in/api/login';
    return this.http
      .post<any>(url, {
        email: username,
        password: password,
      })
      .pipe(
        map((userToken) => {
          const myUser = { email: username, token: userToken.token };
          localStorage.setItem('currentUser', JSON.stringify(myUser));
          this.currentUserSubject.next(myUser);
          return myUser;
        })
      );
  }

  register(email: string, password: string): Observable<any> {
    return this.http
      .post<User>('https://reqres.in/api/register', {
        email: email,
        password: password,
      })
      .pipe(
        map((user) => {
          const myUser = { email: email, token: user.token };
          localStorage.setItem('currentUser', JSON.stringify(myUser));
          console.log('user', myUser);
          this.currentUserSubject.next(myUser);
          return myUser;
        })
      );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
