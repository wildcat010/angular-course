import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../service/authentication/authentication.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { WARNING } from 'src/assets/icon-lib';
import { Subscription } from 'rxjs';
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
  isLoggedIn: boolean = false;
  userEmail: string;

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
    this.subscription = this.authenticationService.currentUserSubject
      .pipe(
        filter((x) => {
          if (x) {
            return true;
          } else {
            this.userEmail = null;
            this.isLoggedIn = false;
            return false;
          }
        })
      )
      .subscribe((user) => {
        this.userEmail = user.email;
        this.isLoggedIn = true;
      });
  }

  getReturnUrl(): string {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
    return this.returnUrl;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    //the form is valid
    this.submitted = true;
    const credentials = this.loginForm.value;
    this.loading = true;
    this.authenticationService
      .login(credentials.username, credentials.password)
      .subscribe(
        () => {
          //success
          if (this.returnUrl) {
            this.router.navigate([this.returnUrl]);
          }
        },
        (error) => {
          console.log('error: ' + error);
          this.error = error;
          this.loading = false;
        },
        () => {
          this.loading = false;
        }
      );
  }

  resetInput(input: string) {
    this.loginForm.get(input).reset();
  }

  signOut() {
    this.authenticationService.logout();
  }

  register() {
    this.router.navigate(['/register']);
  }
}
