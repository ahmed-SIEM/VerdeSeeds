import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackofficeRoutingModule } from './backoffice-routing.module';
import { LayoutsComponent } from './layouts/layouts.component';
import { ChartsComponent } from './pages/charts/charts.component';
import { HomeComponent } from './pages/home/home.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ErrorComponent } from './components/error/error.component';
import { NavComponent } from './components/nav/nav.component';


@NgModule({
  declarations: [
    LayoutsComponent,
    ChartsComponent,
    HomeComponent,
    OrdersComponent,
    ErrorComponent,
    NavComponent,
  
  ],
  imports: [
    CommonModule,
    BackofficeRoutingModule
  ]
})
export class BackofficeModule { }
