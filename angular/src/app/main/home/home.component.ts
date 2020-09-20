import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/shared/service/auth.service';
import { NavItem } from 'src/app/models/nav-item';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  user: User;
  sideMenuItems: NavItem[];
  private _mobileQueryListener: () => void;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private authService: AuthService
  ) {
    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.user = this.authService.user;
  }

  ngOnInit() {
    this.getSideMenuArray();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  getSideMenuArray() {
    const menuArray = [
      {
        displayName: 'User Profile',
        iconName: 'account_circle',
        route: 'profile',
        children: [{
          displayName: 'Account Info',
          iconName: 'edit',
          route: 'main/home/profile/edit',
        },
        {
          displayName: 'Change Password',
          iconName: 'vpn_key',
          route: 'main/home/profile/password',
        }]
      },
      {
        displayName: 'My Notes',
        iconName: 'apps',
        route: 'main/home/mynotes',
        children: []
      }
    ];
    if (this.user && this.user.roles && Array.isArray(this.user.roles) && this.user.roles.length) {
      const multiAccountsManagement = {
        displayName: 'User Management',
        iconName: 'group',
        route: 'main/home/users',
        children: []
      };
      const contentManagement = {
        displayName: 'Notes Content Management',
        iconName: 'book',
        route: 'main/home/notes',
        children: []
      };

      const currentUserRole = this.user.roles[0];
      switch (currentUserRole.name) {
        case 'Founder':
          menuArray.push(multiAccountsManagement);
          menuArray.push(contentManagement);
          break;
        case 'Maintainer':
          menuArray.push(contentManagement);
          break;
        default:
          break;
      }
    }
    this.sideMenuItems = menuArray;
  }

  changePassword() {

  }

}
