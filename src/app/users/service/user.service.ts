import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { UserWithState } from '../model/user-with-state';
import { User } from 'src/app/model/User';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  getUserList(page: number): Observable<any> {
    return this.http.get<any>('https://reqres.in/api/users/?page=' + page);
  }

  getUser(id: number): Observable<any> {
    const url = 'https://reqres.in/api/users/' + id;
    return this.http.get<any>(url);
  }

  deleteUser(id: number): Observable<any> {
    const url = 'https://reqres.in/api/users/' + id;
    return this.http.delete<any>(url);
  }

  updateUser(user: User): Observable<any> {
    const body = JSON.stringify(user.toString());
    console.log('body', body);
    const url = 'https://reqres.in/api/users/' + user.id;
    return this.http.put<any>(url, body);
  }
}
