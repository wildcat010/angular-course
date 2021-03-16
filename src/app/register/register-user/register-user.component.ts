import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/service/authentication/authentication.service';
import { filter } from 'rxjs/operators';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ErrorService } from 'src/app/service/error/error.service';
import { BottomSheetComponent } from 'src/app/components/shared/bottom-sheet/bottom-sheet.component';

/*
With Angular material we have to declare an errorStateMatcher to in our case use the validator - password are not the same
*/
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    formGroup: FormGroupDirective | NgForm | null
  ): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(
      control &&
      control.parent &&
      control.parent.invalid &&
      control.parent.dirty
    );

    return invalidCtrl || invalidParent;
  }
}

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss'],
})
export class RegisterUserComponent implements OnInit {
  hidePassword = true;
  hideConfirmationPassword = true;
  matcher = new MyErrorStateMatcher();
  subscription: Subscription;

  readonly registerForm = this.form.group(
    {
      email: [
        'michael.lawson@reqres.in',
        [Validators.required, Validators.email],
      ],
      password: ['test', Validators.required],
      confirmationPassword: ['test', [Validators.required]],
    },
    { validator: this.checkPasswords }
  );

  constructor(
    private readonly form: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private bottomSheet: MatBottomSheet,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.subscription = this.authService.currentUserSubject
      .pipe(
        filter((x) => {
          if (x) {
            return true;
          } else {
            return false;
          }
        })
      )
      .subscribe(() => {
        this.router.navigate(['/login']); // if someone is auth redirect to login
      });
  }

  onSubmit() {
    this.authService
      .register(
        this.registerForm.controls.email.value,
        this.registerForm.controls.password.value
      )
      .subscribe(
        () => {
          //success
          console.log('success register');
        },
        (error) => {
          this.errorService.currentErrorSubject.next({
            title: error.status,
            description: error.message,
          });
          this.bottomSheet.open(BottomSheetComponent);
        },
        () => {
          this.router.navigate(['/login']);
        }
      );
  }

  resetInput(input: any) {
    this.registerForm.get(input).reset();
  }

  checkPasswords(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.controls.password.value;
    const confirmationPassword = group.controls.confirmationPassword.value;

    return password === confirmationPassword ? null : { notSame: true };
  }
}
