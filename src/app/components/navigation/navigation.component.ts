import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NAVIGATION_MENU } from './navigation-menu';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { LanguageService } from 'src/app/service/language/language.service';
import { LANGUAGE_MENU } from 'src/app/service/language/langugage-menu';
import { LocalStorageService } from 'src/app/service/local-storage/local-storage.service';
import { LOCAL_STORAGE_LANGUAGE } from 'src/app/global/constants';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  isDrawerActive = false;
  displayRouteName: string;
  menuList = NAVIGATION_MENU;
  languageList = LANGUAGE_MENU;
  userLangugage: string = 'en/fr';
  userEmail: string;
  isUserLogged: boolean = false;
  private routeSubscription: Subscription;
  private userSubscription: Subscription;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private languageService: LanguageService,
    private localStorageBrowser: LocalStorageService
  ) {
    this.routeSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        const urlSplit = e.url.split(/[/?]/);
        this.displayRouteName = urlSplit[1];
        if (+urlSplit[2]) {
          this.displayRouteName += ` ${urlSplit[2]}`;
        }
      });
  }

  ngOnInit(): void {
    this.languageService.currentUserSubject.subscribe((lang) => {
      if (lang) {
        this.userLangugage = lang;
      }
    });

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

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  onMenuClick(sidenav: any) {
    sidenav.toggle();
    this.isDrawerActive = !this.isDrawerActive;
  }

  setLangugage(lang: string) {
    this.languageService.currentUserSubject.next(lang);
    this.localStorageBrowser.setLanguageFromLocalStorage(
      LOCAL_STORAGE_LANGUAGE,
      lang
    );
  }

  signOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
