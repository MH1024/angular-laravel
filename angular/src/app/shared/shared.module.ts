import {ModuleWithProviders, NgModule} from '@angular/core';
import { ApiService } from './service/api.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from './material.module';
import { AuthGuard } from './guard/auth.guard';
import { CommonModule } from '@angular/common';
import { PageNotFoundComponent } from './error/page-not-found/page-not-found.component';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MaterialModule,
    ],
    exports: [
        MaterialModule,
        FlexLayoutModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PageNotFoundComponent
    ],
    declarations: [PageNotFoundComponent]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [
                ApiService,
                AuthGuard,
            ]
        };
    }
}
