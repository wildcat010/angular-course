import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../service/authentication/authentication.service';
import { first } from 'rxjs/operators';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { WARNING } from 'src/assets/icon-lib';
import { BehaviorSubject, Subscription } from 'rxjs';
import { User } from 'src/app/model/User';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm = this.form.group({
    username: ['eve.holt@reqres.in', Validators.required],
    password: ['cityslicka', Validators.required],
  });

  submitted: boolean = false;
  loading = false;
  error = '';
  returnUrl: string;
  userLogin: string;
  //private currentUserSubject: BehaviorSubject<User>;
  private subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private readonly form: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    this.iconRegistry.addSvgIconLiteral(
      'warning-icon',
      this.sanitizer.bypassSecurityTrustHtml(WARNING)
    );
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];

    this.authenticationService.currentUserSubject.subscribe((x) => {
      console.log('plouf');
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    //the form is valid
    this.submitted = true;
    const credentials = this.loginForm.value;
    // this.currentUserSubject = new BehaviorSubject<User>(
    //   JSON.parse(localStorage.getItem('currentUser'))
    // );
    this.authenticationService
      .login(credentials.username, credentials.password)
      .pipe(first())
      .subscribe(
        () => {
          //success
          console.log('success ' + this.returnUrl);
          if (this.returnUrl) {
            this.router.navigate([this.returnUrl]);
          }
        },
        (error) => {
          console.log('error: ' + error);
          this.error = error;
          this.loading = false;
        }
      );
  }

  resetInput(input: string) {
    this.loginForm.get(input).reset();
  }
}
