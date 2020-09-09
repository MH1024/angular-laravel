import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/shared/service/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit, OnDestroy {
  isAdminUser = false;
  name: string;
  userChangeSubscribe: Subscription;
  @Output() toggleSideNav = new EventEmitter<any>();
  constructor(
    private authService: AuthService,
    private route: Router,
  ) { }

  ngOnInit() {
    const user = this.authService.user;
    this.userChangeSubscribe = this.authService.onCurrentUserChange.subscribe(
      (resp) => {
          const userInfo = resp;
          this.name = userInfo.name;
      }
  );
  }
  ngOnDestroy() {
    if (this.userChangeSubscribe) {
        this.userChangeSubscribe.unsubscribe();
    }
  }

  editUserDetails() {
    const user = this.authService.user;
    this.route.navigate(['main/home/profile/edit']);
  }

  manageUsers() {

  }

  toggleSideBar() {
    this.toggleSideNav.emit('');
  }

  logout() {
    this.authService.logout();
    this.route.navigate(['/']);
  }

}
