import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/shared/service/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { User } from 'src/app/models/user.model';
import { ErrorHandlerService } from 'src/app/shared/service/error-handler.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorsFromServer: any;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private errorHandleService: ErrorHandlerService
  ) { }

  ngOnInit() {

    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }
  login() {
    if (this.loginForm.invalid) {
      return;
    }
    const username = this.loginForm.get('username').value.trim();
    const password = this.loginForm.get('password').value.trim();
    if (username && password) {
      this.authService.login(username, password).subscribe(
        res => {
          if (res && res['access_token']) {
            this.authService.user = new User();
            this.authService.setSession(res);
          }
          this.errorsFromServer = undefined;
          this.router.navigate(['/main/home']);
        }, error => {
          this.errorsFromServer = undefined;
          if (error && error.error) {
            this.errorHandleService.handleError(error.error);
            this.errorsFromServer = { message: '<span>' + this.errorHandleService.errorMessage + '</span>' };
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
    } else {
      this.snackBar.open(
        'Username or Password can not be empty. Please Check', 'CLOSE', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    }
  }

  closeErrorNotice() {
    this.errorsFromServer = undefined;
  }

}
