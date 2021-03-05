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

  public getCurrentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<any> {
    return this.http
      .post<any>('https://reqres.in/api/login', {
        email: username,
        password: password,
      })
      .pipe(
        map((userToken) => {
          const myUser = { email: username, token: userToken };
          localStorage.setItem('currentUser', JSON.stringify(myUser));
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
