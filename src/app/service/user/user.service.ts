import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  getUserList(): Observable<any> {
    return this.http.get<any>('https://reqres.in/api/users/');
  }
}
