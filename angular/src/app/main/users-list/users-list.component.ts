import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogConfig, MatDialog, MatPaginator, MatSnackBar } from '@angular/material';
import { UserDetailDialogComponent } from './user-detail-dialog/user-detail-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/service/auth.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { ErrorHandlerService } from 'src/app/shared/service/error-handler.service';
import { tap } from 'rxjs/operators';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  displayedColumns = ['name', 'email', 'role', 'createdAt', 'actions'];
  data: any;
  user: User;
  account: Account;
  loadingSubject = new BehaviorSubject<boolean>(false);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  paginatorSubscription: Subscription;
  loading$ = this.loadingSubject.asObservable();
  userList: any;
  loadingList = false;
  errorsFromServer: any;
  usersCount = 0;

  constructor(
    public dialog: MatDialog,
    private activeRoute: ActivatedRoute,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private errorHandleService: ErrorHandlerService
  ) {

  }

  ngOnInit() {

    this.loadUserList();
    this.paginatorSubscription = this.paginator.page
      .pipe(
        tap(() => {
          this.loadUserList();
        })
      ).subscribe();


  }


  openUserDialog(action, userDetails?) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = false;
    dialogConfig.hasBackdrop = true;
    dialogConfig.maxHeight = '800px';
    dialogConfig.disableClose = true;
    dialogConfig.width = '600px';
    dialogConfig.data = {
      action: (action && action === 'new') ? 'new' : 'edit',
      userInfo: (action && action === 'new') ? null : userDetails
    };
    dialogConfig.panelClass = 'app-user-detail-dialog';
    const dialogNew = this.dialog.open(UserDetailDialogComponent, dialogConfig);
    dialogNew.afterClosed()
      .subscribe((response) => {
        if (response) {
          this.loadUserList();
        } else {
          return;
        }

      });
  }

  loadUserList(): void {
    this.loadingList = true;
    this.loadingSubject.next(true);
    const paginatorObj = {
      size: this.paginator.pageSize ? this.paginator.pageSize : 30,
      pageIndex: this.paginator.pageIndex
    };
    this.authService.getUserList(paginatorObj).subscribe(
      res => {
        this.userList = res.data;
        if (res && res.total) {
          this.usersCount = res.total;
        }
        const contentContainer = document.querySelector('.mat-table');
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


  deleteUserDialog(user): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = false;
    dialogConfig.hasBackdrop = true;
    dialogConfig.disableClose = true;
    dialogConfig.maxHeight = '300px';
    dialogConfig.width = '400px';
    dialogConfig.data = {
      userID: user.id,
      confirmMessage: 'Confirm to Delte this user: ' + user.name + ' ?',
      confirmTitle: 'Delete User Confirm'
    };
    dialogConfig.panelClass = 'app-confirm-dialog';
    const dialogNew = this.dialog.open(ConfirmDialogComponent, dialogConfig);
    dialogNew.afterClosed()
      .subscribe((response) => {
        if (response) {
          this.loadUserList();
        } else {
          return;
        }

      });
  }
}
