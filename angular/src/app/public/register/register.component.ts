import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/service/auth.service';
import { ErrorHandlerService } from 'src/app/shared/service/error-handler.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  passRegex = '^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{8,}$';
  registerForm: FormGroup;
  errorsFromServer: any;
  @Output() goToLoginPanel = new EventEmitter<any>();
  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService,
    private errorHandleService: ErrorHandlerService
  ) { }

  ngOnInit() {

    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(this.passRegex)]],
      passwordConfirm: ['', [Validators.required, confirmPassword]],
    });

  }
  register() {
    const registerFormValue = this.registerForm.getRawValue();

    const flatErrors = (errorsObj) => {
      const fieldArray = ['name', 'password', 'email'];
      let innerDiv = '<ul>';
      for (const fieldName of fieldArray) {
        if (errorsObj[fieldName] && Array.isArray(errorsObj[fieldName])) {
          innerDiv += errorsObj[fieldName].reduce((accumulator, currentValue) => {
            const itemDiv = '<li>' + currentValue + '</li>';
            return accumulator + itemDiv;
          }, '');
          console.log(innerDiv);
        }
      }
      innerDiv += '</ul>';
      return innerDiv;
    };
    this.authService.register(registerFormValue).subscribe(
      (resp: any) => {
        this.router.navigate(['/public/login']);
        this.registerForm.reset();
        this.goToLoginPanel.emit('');
        this.snackBar.open(resp, 'Dismiss', {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
      error => {
        if (error) {
          this.errorsFromServer = undefined;
          if (error && error.error) {
            const errorObj = error.error.errors ? { message: flatErrors(error.error.errors) } : error.error;
            this.errorHandleService.handleError(errorObj);
            console.log(this.errorHandleService.errorMessage);
            this.errorsFromServer = { message: '<div>' + this.errorHandleService.errorMessage + '</div>' };
          } else {
            this.snackBar.open(
              'Server Error', 'CLOSE', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
          }
        } else {
          this.snackBar.open(
            'Server Error', 'CLOSE', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        }
      });

  }
  closeErrorNotice() {
    this.errorsFromServer = undefined;
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
