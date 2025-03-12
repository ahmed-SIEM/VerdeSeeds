import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrontofficeRoutingModule } from './frontoffice-routing.module';
import { LayoutsComponent } from './layouts/layouts.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ErrorFrontComponent } from './components/error-front/error-front.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { FarmingPracticeComponent } from './pages/farming-practice/farming-practice.component';
import { HomeComponent } from './pages/home/home.component';
import { NewsdetailsComponent } from './pages/newsdetails/newsdetails.component';
import { NewsComponent } from './pages/news/news.component';
import { OurproductComponent } from './pages/ourproduct/ourproduct.component';
import { ShopComponent } from './pages/shop/shop.component';


@NgModule({
  declarations: [
    LayoutsComponent,
    NavbarComponent,
    FooterComponent,
    ErrorFrontComponent,
    AboutComponent,
    ContactComponent,
    FarmingPracticeComponent,
    HomeComponent,
    NewsdetailsComponent,
    NewsComponent,
    OurproductComponent,
    ShopComponent,

  ],
  imports: [
    CommonModule,
    FrontofficeRoutingModule
  ]
})
export class FrontofficeModule { }
