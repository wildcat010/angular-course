import { Component, OnInit } from '@angular/core';
import { NAVIGATION_MENU } from './navigation-menu';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  isDrawerActive = false;
  menu = NAVIGATION_MENU;

  constructor() {}

  ngOnInit(): void {}

  onMenuClick(sidenav: any) {
    sidenav.toggle();
    this.isDrawerActive = !this.isDrawerActive;
  }
}
