import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { DetailsComponent } from './details/details.component';

const routes: Routes = [
  { 
    path: '', // Cette route correspond à /backoffice/formations
    component: ListComponent // Affiche directement la liste
  },
  { 
    path: 'new', 
    component: EditComponent 
  },
  { 
    path: ':id/edit', // /backoffice/formations/1/edit
    component: EditComponent 
  },
  { 
    path: ':id', // /backoffice/formations/1
    component: DetailsComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormationManagementRoutingModule { }