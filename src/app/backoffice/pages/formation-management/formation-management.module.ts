import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormationManagementRoutingModule } from './formation-management-routing.module';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { DetailsComponent } from './details/details.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ListComponent,
    EditComponent,
    DetailsComponent
  ],
  imports: [
    CommonModule,
    FormationManagementRoutingModule,
    FormsModule
  ]
})
export class FormationManagementModule { }
