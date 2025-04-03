import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlateformeRoutingModule } from './platforme-routing.module';
import { ListPlateformeComponent } from './list/ListPlateforme.component';
import { EditPlateformeComponent } from './edit/EditPlateforme.component';
import { DetailsPlatformComponent } from './details/details.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
      DetailsPlatformComponent,
      EditPlateformeComponent,
      ListPlateformeComponent
    ],
    imports: [
      CommonModule,
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