import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservationListComponent } from './reservation-list/reservation-list.component';
import { ReservationFormComponent } from './reservation-form/reservation-form.component';

const routes: Routes = [
  { 
    path: '', 
    component: ReservationListComponent 
  },
  { 
    path: 'create', 
    component: ReservationFormComponent 
  },
  { 
    path: 'edit/:reservationId', 
    component: ReservationFormComponent 
  },
  { 
    path: 'article/:articleId', 
    component: ReservationListComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationRoutingModule { }
