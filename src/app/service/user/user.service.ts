import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../model/User';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  getUserList(): Observable<any> {
    return this.http.get<any>('https://reqres.in/api/users/').pipe(
      tap((users) => console.log('get the user list')),
      catchError(this.handleError<any>('get user list error', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
