import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../service/authentication/authentication.service';
import { first } from 'rxjs/operators';

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

  constructor(
    private route: ActivatedRoute,
    private readonly form: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    //the form is valid
    this.submitted = true;
    const credentials = this.loginForm.value;
    this.authenticationService
      .login(credentials.username, credentials.password)
      .pipe(first())
      .subscribe(
        () => {
          //success
          console.log('success ' + this.returnUrl);
          this.router.navigate([this.returnUrl]);
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
