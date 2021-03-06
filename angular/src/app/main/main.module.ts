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
import { UsersListComponent } from './users-list/users-list.component';
import { HomeSidenavGroupComponent } from './home-sidenav-group/home-sidenav-group.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { UserDetailDialogComponent } from './users-list/user-detail-dialog/user-detail-dialog.component';
import { ConfirmDialogComponent } from './users-list/confirm-dialog/confirm-dialog.component';
import { ErrorHandlerService } from '../shared/service/error-handler.service';
import { PostsListComponent } from './posts-list/posts-list.component';
import { PostService } from './services/post.services';
import { PostDetailDialogComponent } from './posts-list/post-detail-dialog/post-detail-dialog.component';

const homeRoutes: Routes = [
    {
        path: 'changePassword',
        component: ChangePasswordComponent,
        canActivate: [AuthGuard],
        resolve: {auth: AuthService}
    },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard],
        resolve: {auth: AuthService},
        children: [
            {
                path: '',
                redirectTo: 'mynotes'
            },
            {
                path: 'users',
                component:  UsersListComponent,
            },
            {
                path: 'notes',
                component:  PostsListComponent,
            },
            {
                path: 'mynotes',
                component:  PostsListComponent,
            },
            {
                path: 'profile',
                children: [
                    {
                        path: 'password',
                        component:  ChangePasswordComponent,
                    },
                    {
                        path: 'edit',
                        component:  EditProfileComponent,
                    }
                ]
            }
        ]
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
        ChangePasswordComponent,
        UsersListComponent,
        HomeSidenavGroupComponent,
        EditProfileComponent,
        UserDetailDialogComponent,
        ConfirmDialogComponent,
        PostsListComponent,
        PostDetailDialogComponent
    ],
    imports: [
        RouterModule.forChild(homeRoutes),
        SharedModule,
        ReactiveFormsModule
    ],
    entryComponents: [
        NavBarComponent,
        HomeSidenavGroupComponent,
        UserDetailDialogComponent,
        ConfirmDialogComponent,
        PostDetailDialogComponent
    ],
    providers: [
        AuthService,
        AuthGuard,
        ErrorHandlerService,
        PostService
    ],
    exports: [
        RouterModule
    ],
})
export class MainModule {
}
