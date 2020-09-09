import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/service/auth.service';
import { ErrorHandlerService } from 'src/app/shared/service/error-handler.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  passRegex = '^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{8,}$';
  passwordForm: FormGroup;
  errorsFromServer: any;
  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService,
    private errorHandleService: ErrorHandlerService
  ) { }

  ngOnInit() {

    this.passwordForm = this.formBuilder.group({
      old_password: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.pattern(this.passRegex)]],
      password_confirmation: ['', [Validators.required, confirmPassword]],
  });

  }
  changePassword() {
    const passwordFormValue = this.passwordForm.getRawValue();
    this.authService.changePassword(passwordFormValue).subscribe(
      (res) => {
        if (res && res.status && res.status === 'ok') {
          const msg = (res.data && res.data.message) ? res.data.message : 'update success';
          this.snackBar.open(
            msg, 'CLOSE', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        }
      }, (error) => {
        this.errorsFromServer = undefined;
        if (error && error.error) {
          this.errorHandleService.handleError(error.error);
          this.errorsFromServer = { message: '<span>' + this.errorHandleService.errorMessage + '</span>' };
        } else {
          this.snackBar.open(
            'Server Error', 'CLOSE', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        }
      }
    );

  }
}
function confirmPassword(control: AbstractControl) {
  if (!control.parent || !control) {
      return;
  }

  const password = control.parent.get('password');
  const passwordConfirm = control.parent.get('password_confirmation');

  if (!password || !passwordConfirm) {
      return;
  }

  if (passwordConfirm.value === '') {
      return;
  }

  if (password.value !== passwordConfirm.value) {
      return {
          passwordsNotMatch: true
      };
  }
}
