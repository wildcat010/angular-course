import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NAVIGATION_MENU } from './navigation-menu';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  isDrawerActive = false;
  menu = NAVIGATION_MENU;
  displayRouteName: string;
  routeSubscription: Subscription;

  constructor(private router: Router) {
    console.log(router.url);
    this.routeSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.displayRouteName = e.url.replace('/', ' ');
      });
  }

  ngOnInit(): void {}

  onMenuClick(sidenav: any) {
    sidenav.toggle();
    this.isDrawerActive = !this.isDrawerActive;
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }
}
