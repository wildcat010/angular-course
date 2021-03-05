import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from 'src/app/service/authentication/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.authenticationService.currentUserSubject.subscribe((x) => {
      if (x) {
        console.log('plouf from home', x);
      }
    });
  }
}
