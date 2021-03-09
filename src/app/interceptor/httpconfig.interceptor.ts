import { Injectable } from '@angular/core'
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http'

import { Observable, throwError, Subscription } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { AuthenticationService } from '../service/authentication/authentication.service'
import { filter } from 'rxjs/operators'

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  private userToken: string

  constructor(private authService: AuthenticationService) {
    this.authService.currentUserSubject
      .pipe(
        filter((x) => {
          if (x) {
            return true
          } else {
            this.userToken = null
            return false
          }
        }),
      )
      .subscribe((user) => {
        console.log('interceptor token', user.token)
        this.userToken = user.token
      })
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    //TODO add logic
    if (this.userToken) {
      const authRequest = request.clone({
        setHeaders: { Authorization: this.userToken },
      })
      return next.handle(authRequest);
    } else {
      return next.handle(request);
    }
  }
}
