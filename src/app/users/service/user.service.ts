import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { UserWithState } from '../model/user-with-state';
import { User } from 'src/app/model/User';
import { API_URL_USERS } from 'src/app/global/constants';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  getUserList(page: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    //params = params.append('delay', '3');

    return this.http.get<any>(API_URL_USERS, { params: params });
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
