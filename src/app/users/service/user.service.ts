import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User } from 'src/app/model/User';
import { API_URL_USERS } from 'src/app/global/constants';
import { UserWithState } from '../model/user-with-state';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  getUserList(page: number): Observable<any> {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    //params = params.append('delay', '1');
    return this.http.get<any>(API_URL_USERS, { params: params });
  }

  getUser(id: number): Observable<any> {
    const url = API_URL_USERS + id;
    return this.http.get<any>(url);
  }

  deleteUser(id: number): Observable<any> {
    let params = new HttpParams();
    //params = params.append('delay', '1');
    const url = API_URL_USERS + id;
    return this.http.delete<any>(url, { params: params });
  }

  updateUser(user: User): Observable<any> {
    const body = JSON.stringify(user.toString());
    const url = API_URL_USERS + user.id;
    return this.http.put<any>(url, body);
  }
}
