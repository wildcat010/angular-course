import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { UserWithState } from '../model/user-with-state';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  getUserList(): Observable<any> {
    return this.http.get<any>('https://reqres.in/api/users/');
  }

  getUser(id: number): Observable<any> {
    const url = 'https://reqres.in/api/users/' + id;
    console.log('url', url);
    return this.http.get<any>(url);
  }
}
