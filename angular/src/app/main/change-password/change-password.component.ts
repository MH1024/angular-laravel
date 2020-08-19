import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/service/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  passRegex = '^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{8,}$';
  passwordForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {

    this.passwordForm = this.formBuilder.group({
      old_password: ['', [Validators.required, Validators.pattern(this.passRegex)]],
      password: ['', [Validators.required, Validators.pattern(this.passRegex)]],
      passwordConfirm: ['', [Validators.required, confirmPassword]],
  });

  }
  changePassword() {
    const passwordFormValue = this.passwordForm.getRawValue();
   

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
