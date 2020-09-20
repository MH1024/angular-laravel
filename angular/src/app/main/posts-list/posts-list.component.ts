import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Post } from 'src/app/models/post.model';
import { MatDialogConfig, MatDialog, MatPaginator, MatSnackBar, MatSort } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/service/auth.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { ErrorHandlerService } from 'src/app/shared/service/error-handler.service';
import { tap } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ConfirmDialogComponent } from '../users-list/confirm-dialog/confirm-dialog.component';
import { PostService } from '../services/post.services';
import { PostDetailDialogComponent } from './post-detail-dialog/post-detail-dialog.component';


@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent implements OnInit, OnDestroy {


  data: any;
  user: Post;
  account: Account;
  loadingSubject = new BehaviorSubject<boolean>(false);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  paginatorSubscription: Subscription;
  loading$ = this.loadingSubject.asObservable();
  postsList: any;
  loadingList = false;
  errorsFromServer: any;
  postsCount = 0;
  searchForm: FormGroup;
  searchVal: any;
  constructor(
    public dialog: MatDialog,
    private activeRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private errorHandleService: ErrorHandlerService,
    private formBuilder: FormBuilder,
    private postService: PostService
  ) {

  }

  ngOnInit() {

    this.loadPostList();

    this.paginatorSubscription = this.paginator.page
      .pipe(
        tap(() => {
          const searchCondition = this.searchForm.controls['search'].value;
          const searchParams = searchCondition ? { search: searchCondition.trim() } : {};
          this.loadPostList(searchParams);
        })
      ).subscribe();
    this.searchForm = this.formBuilder.group({
      search: new FormControl(''),
    });

  }

  ngOnDestroy() {
    if (this.paginatorSubscription) {
      this.paginatorSubscription.unsubscribe();
    }
  }


  openPostDialog(action, postDetails?) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = false;
    dialogConfig.hasBackdrop = true;
    dialogConfig.maxHeight = '800px';
    dialogConfig.disableClose = true;
    dialogConfig.width = '600px';
    dialogConfig.data = {
      action: (action && action === 'new') ? 'new' : 'edit',
      postInfo: (action && action === 'new') ? null : postDetails
    };
    dialogConfig.panelClass = 'app-post-detail-dialog';
    const dialogNew = this.dialog.open(PostDetailDialogComponent, dialogConfig);
    dialogNew.afterClosed()
      .subscribe((response) => {
        if (response) {
          this.loadPostList();
        } else {
          return;
        }

      });
  }

  loadPostList(queryParam?): void {
    this.loadingList = true;
    this.loadingSubject.next(true);

    let sendObj = {
      size: this.paginator.pageSize ? this.paginator.pageSize : 10,
      pageIndex: this.paginator.pageIndex
    };

    if (queryParam && queryParam !== {}) {
      const searchParams = queryParam['search'] ? { query: queryParam['search'] } : {};
      sendObj = Object.assign(sendObj, searchParams);
    } else {
      delete sendObj['query'];
    }

    this.postService.getPostsList(sendObj).subscribe(
      res => {
        this.postsList = res.data.map(
          item => new Post(item)
        );
        if (res && res.total) {
          this.postsCount = res.total;
        }
        const contentContainer = document.getElementById('list-top');
        contentContainer.scrollTo(0, 0);

        this.loadingSubject.next(false);
        this.loadingList = false;
      },
      error => {
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
        this.loadingList = false;
        this.loadingSubject.next(false);
      });

  }

  getUserStatus(settings): any {
    if (settings && settings.active && settings.active === 1) {
      return 'user_active';
    } else {
      return 'user_deactivate';
    }
  }


  deletePostDialog(post): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = false;
    dialogConfig.hasBackdrop = true;
    dialogConfig.disableClose = true;
    dialogConfig.maxHeight = '300px';
    dialogConfig.width = '400px';
    dialogConfig.data = {
      action: 'delete-post',
      confirmInfo: {
        postID: post.id,
        confirmMessage: 'Confirm to Delte this note ?',
        confirmTitle: 'Delete note Confirm'
      }
    };
    dialogConfig.panelClass = 'app-confirm-dialog';
    const dialogNew = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogNew.afterClosed()
      .subscribe((response) => {
        if (response) {
          this.loadPostList();
        } else {
          return;
        }

      });
  }

  applyFilter() {
    const searchCondition = this.searchForm.controls['search'].value;
    if (searchCondition && searchCondition.trim()) {
      this.paginator.pageIndex = 0;
      this.patchUsers(searchCondition);
    } else {
      this.paginator.pageIndex = 0;
      this.loadPostList();
    }
  }
  patchUsers(searchQuery) {
    this.loadingList = true;
    this.loadingSubject.next(true);
    const paginatorObj = {
      size: this.paginator.pageSize ? this.paginator.pageSize : 30,
      pageIndex: this.paginator.pageIndex,
      query: searchQuery
    };
    this.postService.getPostsList(paginatorObj).subscribe(
      res => {
        this.postsList = res.data.map(
          item => new Post(item)
        );
        if (res && res.total) {
          this.postsCount = res.total;
        }


        this.loadingSubject.next(false);
        this.loadingList = false;
      },
      error => {
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
        this.loadingList = false;
        this.loadingSubject.next(false);
      });
  }
}
