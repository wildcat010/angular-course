import { MenuItem } from './menu-item';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';

export const NAVIGATION_MENU: MenuItem[] = [
  { label: marker('Home'), routerLink: 'home' },
  { label: marker('Users'), routerLink: 'users' },
  { label: marker('Login'), routerLink: 'login' },
];
