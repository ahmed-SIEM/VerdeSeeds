import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListSponsor } from './list/list.component';
import { EditAddSponsor } from './edit-add/edit-add.component';

const routes: Routes = [
    { path: '', component: ListSponsor },
    { path: 'add', component: EditAddSponsor },
    { path: ':id/edit', component: EditAddSponsor },


];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SponsorManagementRoutingModule { }