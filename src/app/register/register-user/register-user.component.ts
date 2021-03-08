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

  registerForm = this.form.group(
    {
      email: [
        'benoit.bourgeon@gmail.com',
        [Validators.required, Validators.email],
      ],
      password: ['test', Validators.required],
      confirmationPassword: ['test', [Validators.required]],
    },
    { validator: this.checkPasswords }
  );

  constructor(private readonly form: FormBuilder) {}

  ngOnInit(): void {}

  onSubmit() {}

  resetInput(input: any) {
    this.registerForm.get(input).reset();
  }

  checkPasswords(group: FormGroup): { [key: string]: boolean } | null {
    debugger;
    const password = group.controls.password.value;
    const confirmationPassword = group.controls.confirmationPassword.value;

    return password === confirmationPassword ? null : { notSame: true };
  }
}
