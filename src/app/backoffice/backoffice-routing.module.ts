import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutsComponent } from './layouts/layouts.component';
import { HomeComponent } from './pages/home/home.component';
import { ChartsComponent } from './pages/charts/charts.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ErrorComponent } from '../error/error.component';

const routes: Routes = [
  {
  path: '',
  component : LayoutsComponent,
  children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {path : 'home', component : HomeComponent},
    {path : 'charts', component : ChartsComponent },
    {path : 'orders', component : OrdersComponent},
    {path : 'error', component : ErrorComponent}

  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackofficeRoutingModule { }
