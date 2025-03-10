import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackofficeRoutingModule } from './backoffice-routing.module';
import { LayoutsComponent } from './layouts/layouts.component';
import { HomeComponent } from './pages/home/home.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ErrorComponent } from './components/error/error.component';
import { NavComponent } from './components/nav/nav.component';
import { ProductManagementComponent } from './pages/product-management/product-management.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { PlatformManagementComponent } from './pages/platform-management/platform-management.component';
import { CoursesManagementComponent } from './pages/courses-management/courses-management.component';
import { MarketplaceManagementComponent } from './pages/marketplace-management/marketplace-management.component';
import { AccountComponent } from './pages/account/account.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { NotificationComponent } from './pages/notification/notification.component';
import { ResetpasswordComponent } from './pages/resetpassword/resetpassword.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';


@NgModule({
  declarations: [
    LayoutsComponent,
    HomeComponent,
    OrdersComponent,
    ErrorComponent,
    NavComponent,
    ProductManagementComponent,
    UserManagementComponent,
    PlatformManagementComponent,
    CoursesManagementComponent,
    MarketplaceManagementComponent,
    AccountComponent,
    SettingsComponent,
    NotificationComponent,
    ResetpasswordComponent,
    SignUpComponent,
  ],
  imports: [
    CommonModule,
    BackofficeRoutingModule
  ]
})
export class BackofficeModule { }
