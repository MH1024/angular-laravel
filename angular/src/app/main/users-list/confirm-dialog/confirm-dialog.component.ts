import { Inject, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/service/auth.service';
import { ErrorHandlerService } from 'src/app/shared/service/error-handler.service';
import { PostService } from '../../services/post.services';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ConfirmDialogComponent implements OnInit {
  consignment: any;
  sendData: any;
  confirmMessage: string;
  confirmTitle: string;
  confirmInfo: any;
  errorsFromServer: any;
  action: string;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private postService: PostService,
    private errorHandleService: ErrorHandlerService
  ) {
    this.confirmInfo = data.confirmInfo;
    this.confirmMessage = this.confirmInfo.confirmMessage;
    this.confirmTitle = this.confirmInfo.confirmTitle;
    this.action = data.action;
  }

  ngOnInit() {

  }
  closeErrorNotice() {
    this.errorsFromServer = undefined;
  }

  submit() {
    const confirmObservable = (action, deleteObj): Observable<any> => {
      switch (action) {
        case 'delete-user':
          const selectedUserID = { user_id: deleteObj.userID };
          return this.authService.deleteUser(selectedUserID);
        case 'delete-post':
          const selectedPostID = { post_id: deleteObj.postID };
          return this.postService.deletePost(selectedPostID);
          break;
        default:
          break;
      }
    };
    confirmObservable(this.action, this.confirmInfo).subscribe(
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
