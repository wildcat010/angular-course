import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        // debugger;
        // const currentUser = this.authenticationService.currentUserValue;
        // if (currentUser) {
        //     // logged in so return true
        //     return true;
        // }
        
        console.log("can activate");

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        debugger;
        if(state.url){
            const b = `you are redirected to the login page - ${state.url}`
        }

        return false;
    }
}