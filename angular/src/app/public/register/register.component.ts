import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  passRegex = '^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{8,}$';
  registerForm: FormGroup;
  @Output() goToLoginPanel = new EventEmitter<any>();
  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService
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
    this.authService.register(registerFormValue).subscribe(
      (resp: any) => {
          this.router.navigate(['/']);
          this.registerForm.reset();
          this.goToLoginPanel.emit('');
          this.snackBar.open(resp.message, 'Dismiss', {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
        });
      },
      error => {
          if (error.message) {
              this.snackBar.open(error.message, 'Dismiss', {
                  duration: 5000,
                  horizontalPosition: 'right',
                  verticalPosition: 'top',
              });
          } else {
              this.snackBar.open(error, 'Dismiss', {
                  duration: 5000,
                  horizontalPosition: 'right',
                  verticalPosition: 'top',
              });
          }
      });

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