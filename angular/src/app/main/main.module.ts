import { HomeComponent } from './home/home.component';
import { NgModule} from '@angular/core';
import { SharedModule} from '../shared/shared.module';
import { RouterModule, Routes} from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../shared/service/auth.service';
import { PageNotFoundComponent } from '../shared/error/page-not-found/page-not-found.component';
import { AuthGuard } from '../shared/guard/auth.guard';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

const homeRoutes: Routes = [
    {
        path: 'changePassword',
        component: ChangePasswordComponent,
        /* canActivate: [AuthGuard],
        resolve: {auth: AuthService}, */
    },
    {
        path: 'home',
        component: HomeComponent,
        /* canActivate: [AuthGuard],
        resolve: {auth: AuthService}, */
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }
];

@NgModule({
    declarations: [
        HomeComponent,
        NavBarComponent,
        ChangePasswordComponent
    ],
    imports: [
        RouterModule.forChild(homeRoutes),
        SharedModule,
        ReactiveFormsModule
    ],
    entryComponents: [
        NavBarComponent
    ],
    providers: [
        AuthService
    ],
    exports: [
        RouterModule
    ],
})
export class MainModule {
}
