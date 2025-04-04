import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PlateformeRoutingModule } from './platforme-routing.module';
import { ListPlateformeComponent } from './list/ListPlateforme.component';

import { DetailsPlatformComponent } from './details/details.component';

@NgModule({
  declarations: [
    ListPlateformeComponent,
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
    PlateformeRoutingModule,
    ListPlateformeComponent
  ]
})
export class PlatformeModule { }