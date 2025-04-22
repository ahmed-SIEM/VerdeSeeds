import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ComponentManagementRoutingModule } from './component-management-routing.module';
import { ListComponent } from './list/list.component';
import { EditAddComponent } from './edit-add/edit-add.component';

@NgModule({
  declarations: [
    ListComponent,
    EditAddComponent,
  ],
  imports: [
    CommonModule,
    ComponentManagementRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    ListComponent,
    EditAddComponent,
  ]
})
export class ComponentManagementModule { }
