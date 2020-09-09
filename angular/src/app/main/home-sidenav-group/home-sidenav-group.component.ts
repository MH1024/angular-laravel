import { Component, HostBinding, Input, OnInit, OnDestroy } from '@angular/core';
import { Event, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-home-sidenav-group',
  templateUrl: './home-sidenav-group.component.html',
  styleUrls: ['./home-sidenav-group.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class HomeSidenavGroupComponent implements OnInit, OnDestroy {
  expanded: boolean;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item: any;
  @Input() depth: number;
  mainMenuItems = [
    'User Management',
    'Bookings'
  ];
  subscribeRoute: any;

  constructor(// public navService: NavService,
    public router: Router,
    private activeRoute: ActivatedRoute,
  ) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  ngOnInit() {

    const snapUrl = this.router.url;
    const urlIntoArray = snapUrl.split('/');

    if (this.item && this.item.route) {
      this.expanded = urlIntoArray.indexOf(this.item.route) === 4;
    }

    this.subscribeRoute = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects.toString();
        const urlArray = url.split('/');
        if (this.item.route) {
          this.expanded = urlArray.indexOf(this.item.route) === 4;
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscribeRoute) {
      this.subscribeRoute.unsubscribe();
    }
  }

  onItemSelected(item: any) {
    if (!item.children || !item.children.length) {
      this.router.navigate([item.route]);
    }
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }
  }

  onMenuSelected(item: any) {
    this.router.navigate([item.route]);
  }
}
