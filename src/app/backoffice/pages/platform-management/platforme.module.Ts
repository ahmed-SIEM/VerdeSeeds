import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PlateformeRoutingModule } from './platforme-routing.module';
import { ListPlateformeComponent } from './list/ListPlateforme.component';
import { EditPlateformeComponent } from './edit/EditPlateforme.component';
import { DetailsPlatformComponent } from './details/details.component';

@NgModule({
  declarations: [
    ListPlateformeComponent,
    EditPlateformeComponent,
    DetailsPlatformComponent
  ],
  imports: [
    CommonModule,
    PlateformeRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    DetailsPlatformComponent,
    EditPlateformeComponent,
    PlateformeRoutingModule,
    ListPlateformeComponent
  ]
})
export class PlatformeModule { }