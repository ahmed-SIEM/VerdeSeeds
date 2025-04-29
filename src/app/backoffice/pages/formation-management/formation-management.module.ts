import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FormationManagementRoutingModule } from './formation-management-routing.module';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { EditDetailsComponent } from './edit-details/edit-details.component';
import { DetailsComponent } from './details/details.component';
import { StatistiquesComponent } from './statistiques/statistiques.component';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    ListComponent,
    EditComponent,
    EditDetailsComponent,
    DetailsComponent,
    StatistiquesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    FormationManagementRoutingModule,
    NgChartsModule
  ]
})
export class FormationManagementModule {}
