import {ModuleWithProviders, NgModule} from '@angular/core';
import { ApiService } from './service/api.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './material.module';
import { AuthGuard } from './guard/auth.guard';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from './error/page-not-found/page-not-found.component';
import { InternalServerErrorComponent } from './error/internal-server-error/internal-server-error.component';
import { ErrorHandlerService } from './service/error-handler.service';
import { ErrorDisplayPanelComponent } from './error/error-display-panel/error-display-panel.component';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MaterialModule,
        RouterModule,
    ],
    exports: [
        MaterialModule,
        FlexLayoutModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PageNotFoundComponent,
        InternalServerErrorComponent,
        ErrorDisplayPanelComponent
    ],
    declarations: [
        PageNotFoundComponent,
        InternalServerErrorComponent,
        ErrorDisplayPanelComponent
    ]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [
                ApiService,
                AuthGuard,
                ErrorHandlerService
            ]
        };
    }
}
