import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FormationManagementRoutingModule } from './formation-management-routing.module';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { EditDetailsComponent } from './edit-details/edit-details.component';
import { DetailsComponent } from './details/details.component';

@NgModule({
  declarations: [
    ListComponent,
    EditComponent,
    EditDetailsComponent,
    DetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    FormationManagementRoutingModule
  ]
})
export class FormationManagementModule {}
