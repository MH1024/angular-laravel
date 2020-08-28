import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {RouterModule, Routes} from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthPanelComponent } from './auth-panel/auth-panel.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../shared/service/auth.service';
import { PageNotFoundComponent } from '../shared/error/page-not-found/page-not-found.component';
import { InternalServerErrorComponent } from '../shared/error/internal-server-error/internal-server-error.component';


const publicRoutes: Routes = [
    {
        path: 'login',
        component: AuthPanelComponent,
    },
    {
        path: '404',
        component: PageNotFoundComponent,
    },
    {
        path: '500',
        component: InternalServerErrorComponent,
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }
];

@NgModule({
    declarations: [
        LoginComponent,
        RegisterComponent,
        AuthPanelComponent
    ],
    imports: [
        RouterModule.forChild(publicRoutes),
        SharedModule,
        ReactiveFormsModule
    ],
    entryComponents: [],
    providers: [
        AuthService
    ],
    exports: [
        RouterModule
    ],
})
export class PublicModule {
}
