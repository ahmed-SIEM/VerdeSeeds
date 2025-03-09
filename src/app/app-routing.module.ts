import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './error/error.component';

const routes: Routes = [

  {path: '', redirectTo: 'frontoffice', pathMatch: 'full'},
{
  path: 'frontoffice',
  loadChildren: () => import('./frontoffice/frontoffice.module').then(m => m.FrontofficeModule)
},

{
   path: 'backoffice',
    loadChildren: () => import('./backoffice/backoffice.module').then(m => m.BackofficeModule)
},

  {path : '**', component: ErrorComponent}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
