import { Component, OnInit } from '@angular/core';
import { FOOTER_LOGOS } from './footer-logos';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  logos = FOOTER_LOGOS;

  constructor() {}

  ngOnInit(): void {}
}
