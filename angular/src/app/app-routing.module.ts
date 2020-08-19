import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: 'main',
        loadChildren: './main/main.module#MainModule',
    },
    {
        path: 'public',
        loadChildren: './public/public.module#PublicModule',
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
