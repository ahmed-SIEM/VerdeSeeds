import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { LayoutsComponent } from './layouts/layouts.component';
import { HomeComponent } from './pages/home/home.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ErrorComponent } from '../error/error.component';
import { ProductManagementComponent } from './pages/product-management/product-management.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { CoursesManagementComponent } from './pages/courses-management/courses-management.component';
import { PlatformManagementComponent } from './pages/platform-management/platform-management.component';
import { MarketplaceManagementComponent } from './pages/marketplace-management/marketplace-management.component';
import { AccountComponent } from './pages/account/account.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { NotificationComponent } from './pages/notification/notification.component';
import { ResetpasswordComponent } from './pages/resetpassword/resetpassword.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { LayoutsComponent } from './layouts/layouts.component'; 

const routes: Routes = [
  {
  path: '',
  component : LayoutsComponent,
  children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {path : 'home', component : HomeComponent},
    {path : 'orders', component : OrdersComponent},
    {path : 'error', component : ErrorComponent},
    {path : 'user', component : UserManagementComponent},
    {path : 'product', component : ProductManagementComponent},
    {path : 'courses', component : CoursesManagementComponent},
    {path : 'platform', component : PlatformManagementComponent},
    {path : 'marketplace', component : MarketplaceManagementComponent},
    {path : 'account', component : AccountComponent},
    {path : 'settings', component : SettingsComponent},
    {path : 'notification', component : NotificationComponent},
    {path : 'resetpassword', component : ResetpasswordComponent},    
    {path : 'signup', component : SignUpComponent},
    { 
      path: '', 
      component: LayoutsComponent ,
      children: [
        { path: 'home', component: HomeComponent },
        { 
          path: 'formations',
          loadChildren: () => import('./pages/formation-management/formation-management.module')
            .then(m => m.FormationManagementModule)
        }
  ]
  },
],
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackofficeRoutingModule { }
