import { Inject, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorHandlerService } from 'src/app/shared/service/error-handler.service';
import { PostService } from '../../services/post.services';
@Component({
  selector: 'app-post-detail-dialog',
  templateUrl: './post-detail-dialog.component.html',
  styleUrls: ['./post-detail-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PostDetailDialogComponent implements OnInit {

  dialogTitle: string;
  postDetailsInfo: any;
  postInfoForm: FormGroup;
  errorsFromServer: any;
  action: string;

  constructor(
    public dialogRef: MatDialogRef<PostDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder,
    private postService: PostService,
    private snackBar: MatSnackBar,
    private errorHandleService: ErrorHandlerService
  ) {
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Note';
      this.postDetailsInfo = data.postInfo;
    } else {
      this.dialogTitle = 'Add New Note';
      this.postDetailsInfo = null;
    }
  }

  ngOnInit() {
    this.postInfoForm = this.createUserInfoForm();
  }


  closeErrorNotice() {
    this.errorsFromServer = undefined;
  }

  createUserInfoForm() {
    if (this.action === 'edit') {
      return this.formBuilder.group({
        title: [this.postDetailsInfo.title, [Validators.required, Validators.minLength(3)]],
        excerpt: [this.postDetailsInfo.excerpt, []],
        body: [this.postDetailsInfo.body, [Validators.required, Validators.minLength(3)]]
      });
    } else {
      return this.formBuilder.group({
        title: ['', [Validators.required, Validators.minLength(3)]],
        excerpt: ['', []],
        body: ['', [Validators.required, Validators.minLength(3)]]
      });
    }

  }

  savePostInfoForm() {
    if (this.postInfoForm.invalid) {
      this.snackBar.open(
        'Form is invalid', 'CLOSE', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    } else {
      const changeResult = this.postInfoForm.getRawValue();

      const keyArray = ['body', 'excerpt', 'body'];
      for (const keyItem of keyArray) {
        if (changeResult[keyItem] && typeof changeResult[keyItem] === 'string') {
          changeResult[keyItem] = changeResult[keyItem].trim();
        }
      }
      if (this.postDetailsInfo && this.action === 'edit') {
        changeResult['post_id'] = this.postDetailsInfo.id;
      } else {
        delete changeResult['post_id'];
      }
      this.postService.savePost(this.action, changeResult).subscribe(
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
