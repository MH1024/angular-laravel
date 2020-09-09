import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/service/auth.service';
import { ErrorHandlerService } from 'src/app/shared/service/error-handler.service';
import { User } from 'src/app/models/user.model';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  profileForm: FormGroup;
  errorsFromServer: any;
  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService,
    private errorHandleService: ErrorHandlerService
  ) { }

  ngOnInit() {
    const me = this.authService.user;
    this.profileForm = this.formBuilder.group({
      name: [me.name, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
    });

  }
  changeProfile() {
    const formValue = this.profileForm.getRawValue();
    this.authService.changeProfile(formValue).subscribe(
      (res) => {
        if (res && res.status && res.status === 'ok') {

          const msg = (res.data && res.data.message) ? res.data.message : 'update success';
          if (res.data && res.data.user) {
            this.authService.onCurrentUserChange.next(new User(res.data.user))
          }

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

  closeErrorNotice() {
    this.errorsFromServer = undefined;
  }
}
