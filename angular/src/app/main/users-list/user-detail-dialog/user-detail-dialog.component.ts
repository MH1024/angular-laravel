import { Inject, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from 'src/app/shared/service/auth.service';
import { ErrorHandlerService } from 'src/app/shared/service/error-handler.service';

@Component({
  selector: 'app-user-detail-dialog',
  templateUrl: './user-detail-dialog.component.html',
  styleUrls: ['./user-detail-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserDetailDialogComponent implements OnInit {
  dataSource: any;
  dialogTitle: string;
  userDetailsInfo: any;
  userInfoForm: FormGroup;
  userFormErrors: any;
  errorsFromServer: any;
  action: string;
  passwordPanel = false;
  passRegex = '^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{8,}$';
  constructor(
    public dialogRef: MatDialogRef<UserDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private errorHandleService: ErrorHandlerService
  ) {
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Edit User';
      this.userDetailsInfo = data.userInfo;
    } else {
      this.dialogTitle = 'Add New User';
      this.userDetailsInfo = null;
    }
  }

  ngOnInit() {
    this.userInfoForm = this.createUserInfoForm();
  }

  changePasswordPanel() {
    if (this.userInfoForm.controls['isChangePassword'].value === true) {
      //  checkbox checked input enable
      this.userInfoForm.controls['password'].enable();
      this.userInfoForm.controls['password'].setValidators([Validators.required, Validators.pattern(this.passRegex)]);
      this.userInfoForm.controls['password'].updateValueAndValidity();
      this.userInfoForm.controls['passwordConfirm'].enable();
      this.userInfoForm.controls['passwordConfirm'].setValidators([Validators.required, confirmPassword]);
      this.userInfoForm.controls['passwordConfirm'].updateValueAndValidity();
    } else {
      // unchecked input disable
      this.userInfoForm.controls['password'].disable();
      this.userInfoForm.controls['password'].clearValidators();
      this.userInfoForm.controls['password'].updateValueAndValidity();
      this.userInfoForm.controls['passwordConfirm'].disable();
      this.userInfoForm.controls['passwordConfirm'].clearValidators();
      this.userInfoForm.controls['passwordConfirm'].updateValueAndValidity();

    }
  }
  closeErrorNotice() {
    this.errorsFromServer = undefined;
  }

  onUserFormValuesChanged() {
    for (const field in this.userFormErrors) {
      if (!this.userFormErrors.hasOwnProperty(field)) {
        continue;
      }
      this.userFormErrors[field] = {};
      const control = this.userInfoForm.get(field);
      if (control && control.dirty && !control.valid) {
        this.userFormErrors[field] = control.errors;
      }
    }
  }

  createUserInfoForm() {
    if (this.action === 'edit') {
      return this.formBuilder.group({
        name: [this.userDetailsInfo.name, [Validators.required]],
        email: [{ value: this.userDetailsInfo.email, disabled: true }],
        isChangePassword: [true],
        password: ['', [Validators.required, Validators.pattern(this.passRegex)]],
        passwordConfirm: ['', [Validators.required, confirmPassword]],
      });
    } else {
      return this.formBuilder.group({
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.pattern(this.passRegex)]],
        passwordConfirm: ['', [Validators.required, confirmPassword]],
      });
    }

  }

  validateUserInfoForm() {
    if (this.userInfoForm.invalid) {
      this.snackBar.open(
        'Form is invalid', 'CLOSE', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    } else {
      const changeResult = this.userInfoForm.getRawValue();

      const keyArray = ['name', 'email', 'password'];
      for (const keyItem of keyArray) {
        if (changeResult[keyItem] && typeof changeResult[keyItem] === 'string') {
          changeResult[keyItem] = changeResult[keyItem].trim();
        }
      }
      delete changeResult.passwordConfirm;
      if (this.userDetailsInfo && this.action === 'edit') {
        delete changeResult['email'];
        changeResult['user_id'] = this.userDetailsInfo.id;
        if (this.userInfoForm.controls['isChangePassword'].value === false) {
          delete changeResult['password'];
        }
      } else {
        delete changeResult['user_id'];
      }
      this.authService.saveUser(this.action, changeResult).subscribe(
        (res) => {
          if (res && res.status && res.status === 'ok') {

            const msg = (res.data && res.data.message) ? res.data.message : 'save success';
            this.dialogRef.close(true);
            this.snackBar.open(
              msg, 'CLOSE', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
          }
        }, (error) => {
          if (error && error.error) {
            const errorObj = error.error.errors ? { message: this.errorHandleService.flatErrors(error.error.errors) } : error.error;
            this.errorHandleService.handleError(errorObj);
            this.errorsFromServer = { message: '<div>' + this.errorHandleService.errorMessage + '</div>' };
          } else {
            this.snackBar.open(
              'Server Error', 'CLOSE', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
          }
        }
      );


    }



  }

}

function confirmPassword(control: AbstractControl) {
  if (!control.parent || !control) {
    return;
  }

  const password = control.parent.get('password');
  const passwordConfirm = control.parent.get('passwordConfirm');

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

