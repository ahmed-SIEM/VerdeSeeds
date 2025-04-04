import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListPlateformeComponent } from './list/ListPlateforme.component';
import { EditPlateformeComponent } from './edit/edit.component';
import { DetailsPlatformComponent } from './details/details.component';

const routes: Routes = [
  { 
    path: '', 
    component: ListPlateformeComponent 
  },
  { 
    path: 'new', 
    component: EditPlateformeComponent 
  },
  { 
    path: ':id/edit',
    component: EditPlateformeComponent 
  },
  { 
    path: ':id', 
    component: DetailsPlatformComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlateformeRoutingModule { }