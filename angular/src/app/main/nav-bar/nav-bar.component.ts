import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/service/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {

  }

  logout() {
    this.authService.logout();
  }

}
