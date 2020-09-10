import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogConfig, MatDialog, MatPaginator, MatSnackBar, MatSort } from '@angular/material';
import { UserDetailDialogComponent } from './user-detail-dialog/user-detail-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/service/auth.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { ErrorHandlerService } from 'src/app/shared/service/error-handler.service';
import { tap } from 'rxjs/operators';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

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
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  paginatorSubscription: Subscription;
  loading$ = this.loadingSubject.asObservable();
  userList: any;
  loadingList = false;
  errorsFromServer: any;
  usersCount = 0;
  searchForm: FormGroup;
  searchVal: any;
  constructor(
    public dialog: MatDialog,
    private activeRoute: ActivatedRoute,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private errorHandleService: ErrorHandlerService,
    private formBuilder: FormBuilder
  ) {

  }

  ngOnInit() {

    this.loadUserList();
    const combineSortAndSearch = () => {
      const searchCondition = this.searchForm.controls['search'].value;
      const searchParams = searchCondition ? { search: searchCondition.trim() } : {};
      if (this.sort.active && this.sort.direction) {
        const params = {
          sortby: this.sort.active,
          sorttype: this.sort.direction
        };
        const result = Object.assign(params, searchParams);
        this.loadUserList(result);
      } else {
        this.loadUserList(searchParams);
      }
    };
    this.paginatorSubscription = this.paginator.page
      .pipe(
        tap(() => {
          combineSortAndSearch();
        })
      ).subscribe();

    this.sort.sortChange
      .pipe(
        tap(() => {
          combineSortAndSearch();
        })).subscribe();
    this.searchForm = this.formBuilder.group({
      search: new FormControl(''),
    });

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

  loadUserList(queryParam?): void {
    this.loadingList = true;
    this.loadingSubject.next(true);

    let sendObj = {
      size: this.paginator.pageSize ? this.paginator.pageSize : 10,
      pageIndex: this.paginator.pageIndex
    };

    if (queryParam && queryParam !== {}) {
      const sort = (queryParam['sortby'] && queryParam['sorttype']) ? { sortby: queryParam['sortby'], sorttype: queryParam['sorttype'] } : {};
      const searchParams = queryParam['search'] ? { query: queryParam['search'] } : {};
      sendObj = Object.assign(sendObj, searchParams, sort);
    } else {
      delete sendObj['sort'];
      delete sendObj['sorttype'];
      delete sendObj['query'];
    }

    this.authService.getUserList(sendObj).subscribe(
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

  applyFilter() {
    const searchCondition = this.searchForm.controls['search'].value;
    if (searchCondition && searchCondition.trim()) {
      this.paginator.pageIndex = 0;
      this.patchUsers(searchCondition);
    } else {
      this.paginator.pageIndex = 0;
      this.loadUserList();
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
    this.authService.getUserList(paginatorObj).subscribe(
      res => {
        this.userList = res.data;
        if (res && res.total) {
          this.usersCount = res.total;
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
