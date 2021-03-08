import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/User';
import { AuthenticationService } from '../authentication/authentication.service';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private userLoginSubscription: Subscription;
  private userLogged: User;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.userLoginSubscription = this.authenticationService.currentUserSubject
      .pipe(
        filter((x) => {
          if (x) {
            return true;
          } else {
            this.userLogged = null;
            return false;
          }
        })
      )
      .subscribe((user) => {
        console.log('guard', user);
        this.userLogged = user;
      });
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.userLogged) {
      return true;
    }
    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  canDeactivate() {
    this.userLoginSubscription.unsubscribe();
    this.router.navigate(['/home']);
    return true;
  }
}
