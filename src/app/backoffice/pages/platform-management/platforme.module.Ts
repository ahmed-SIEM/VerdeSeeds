import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PlateformeRoutingModule } from './platforme-routing.module';
import { ListPlateformeComponent } from './list/ListPlateforme.component';
import { DetailsPlatformComponent } from './details/details.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ColumnswithiconsComponent } from 'src/app/frontoffice/components/plateformeComps/features/columnswithicons/columnswithicons.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    ListPlateformeComponent,
    DetailsPlatformComponent,
  ],
  imports: [
    ColumnswithiconsComponent,
    CommonModule,
    PlateformeRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ],
  exports: [
    DetailsPlatformComponent,
    PlateformeRoutingModule,
    ListPlateformeComponent
  ]
})
export class PlatformeModule { }