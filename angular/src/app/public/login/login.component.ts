import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/shared/service/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

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
                this.router.navigate(['/']);

            }, error => {
                if (error && error.status_code && error.status_code === 422 ) {
                    this.snackBar.open(
                        'Invalid Input. Please Check', 'CLOSE', {
                            duration: 3000,
                            horizontalPosition: 'right',
                            verticalPosition: 'top',
                        });
                }  else if (error && error.message) {
                    this.snackBar.open(
                        error.message, 'CLOSE', {
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
