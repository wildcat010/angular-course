import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../service/authentication/authentication.service';
import { filter } from 'rxjs/operators';

@Injectable()
export class AuthHeaderInterceptor implements HttpInterceptor {
  private userToken: string;

  constructor(private authService: AuthenticationService) {
    this.authService.currentUserSubject
      .pipe(
        filter((x) => {
          if (x) {
            return true;
          } else {
            this.userToken = null;
            return false;
          }
        })
      )
      .subscribe((user) => {
        this.userToken = user.token;
      });
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.userToken) {
      const authRequest = request.clone({
        setHeaders: { Authorization: this.userToken },
      });
      return next.handle(authRequest);
    } else {
      return next.handle(request);
    }
  }
}
