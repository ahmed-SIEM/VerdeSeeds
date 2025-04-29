import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SponsorManagementRoutingModule } from './sponsor-management-routing.module';
import { ListSponsor } from './list/list.component';
import { EditAddSponsor } from './edit-add/edit-add.component';
import { SharedModule } from 'src/app/shared/shared.module';

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
    SharedModule
  ],
  exports: [
    ListSponsor,
    EditAddSponsor,
  ]
})
export class SponsorManagementModule { }