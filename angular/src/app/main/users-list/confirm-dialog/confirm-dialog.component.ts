import { Inject, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { AuthService } from 'src/app/shared/service/auth.service';
import { ErrorHandlerService } from 'src/app/shared/service/error-handler.service';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ConfirmDialogComponent implements OnInit {
  consignment: any;
  bulkSubmitProcessing = false;
  sendData: any;
  confirmMessage: any;
  confirmTitle: any;
  userID: any;
  errorsFromServer: any;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private errorHandleService: ErrorHandlerService
  ) {
    this.confirmMessage = data.confirmMessage;
    this.confirmTitle = data.confirmTitle;
    this.userID = data.userID;
  }

  ngOnInit() {

  }
  closeErrorNotice() {
    this.errorsFromServer = undefined;
  }

  submit() {
    const selectedUserID = { user_id: this.userID };
    this.authService.deleteUser(selectedUserID).subscribe(
      (res) => {
        if (res && res.status && res.status === 'ok') {

          const msg = (res.data && res.data.message) ? res.data.message : 'delete success';
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
