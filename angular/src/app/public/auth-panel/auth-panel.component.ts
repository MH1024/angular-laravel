import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material';


@Component({
  selector: 'app-auth-panel',
  templateUrl: './auth-panel.component.html',
  styleUrls: ['./auth-panel.component.scss']
})
export class AuthPanelComponent implements OnInit {
  title = 'demoApp';
  @ViewChild('tabs', {static: false}) tabGroup: MatTabGroup;
  constructor() { }

  ngOnInit() {
  }

  setTabToLoginPanel() {
    this.tabGroup.selectedIndex = 0;
  }

}