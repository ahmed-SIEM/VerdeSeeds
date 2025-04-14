import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SponsorManagementRoutingModule } from './sponsor-management-routing.module';
import { ListSponsor } from './list/list.component';
import { EditAddSponsor } from './edit-add/edit-add.component';

@NgModule({
  declarations: [
    ListSponsor,
    EditAddSponsor,
  ],
  imports: [
    CommonModule,
    SponsorManagementRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    ListSponsor,
    EditAddSponsor,
  ]
})
export class SponsorManagementModule { }
