import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/shared/service/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
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
              console.log(res);
                  if ( res && res['access_token']) {
                      this.authService.user = new User();
                      this.authService.setSession(res);
                  }
                this.router.navigate(['/main/home']);

            }, error => {
              console.log(error);
              if (error && error.errors && Array.isArray(error.errors)) {
                  const errorString = error.errors.reduce((a, b) => a + ',' + b, '');
                  this.snackBar.open(
                      errorString, 'CLOSE', {
                          duration: 3000,
                          horizontalPosition: 'right',
                          verticalPosition: 'top',
                      });
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

}
