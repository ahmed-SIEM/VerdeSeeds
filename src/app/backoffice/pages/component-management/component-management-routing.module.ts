import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { EditAddComponent } from './edit-add/edit-add.component';
import { DetailsComponent } from './details/details.component';

const routes: Routes = [
    { path: '', component: ListComponent },
    { path: 'add', component: EditAddComponent },
    { path: ':id/edit', component: EditAddComponent },
    { path: ':id/details', component: DetailsComponent },


];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ComponentManagementRoutingModule { }
