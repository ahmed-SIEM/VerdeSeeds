import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { DetailsComponent } from './details/details.component';
import { EditDetailsComponent } from './edit-details/edit-details.component';

const routes: Routes = [
  { path: '', component: ListComponent },
  { path: 'new', component: EditComponent },
  { path: 'edit/:id', component: EditComponent }, // ✅ Pour édition
  { path: 'edit-details/:id', component: EditDetailsComponent },
  { path: 'details/:id', component: DetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormationManagementRoutingModule {}
