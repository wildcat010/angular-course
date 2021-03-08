import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NAVIGATION_MENU } from './navigation-menu';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  isDrawerActive = false;
  displayRouteName: string;
  menuList = NAVIGATION_MENU;
  userEmail: string;
  isUserLogged: boolean = false;
  private routeSubscription: Subscription;
  private userSubscription: Subscription;

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {
    this.routeSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        const urlSplit = e.url.split(/[/?]/);
        this.displayRouteName = urlSplit[1];
      });
  }

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUserSubject
      .pipe(
        filter((x) => {
          if (x) {
            return true;
          } else {
            this.userEmail = null;
            this.isUserLogged = false;
            return false;
          }
        })
      )
      .subscribe((user) => {
        this.userEmail = user.email;
        this.isUserLogged = true;
      });
  }

  onMenuClick(sidenav: any) {
    sidenav.toggle();
    this.isDrawerActive = !this.isDrawerActive;
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  signOut() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
