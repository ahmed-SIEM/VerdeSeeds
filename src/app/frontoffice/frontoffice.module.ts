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
import { CenteredheroComponent } from './components/plateformeComps/heros/centeredhero/centeredhero.component';
import { VerticallycenteredheroComponent } from './components/plateformeComps/heros/verticallycenteredhero/verticallycenteredhero.component';
import { HerowithimageComponent } from './components/plateformeComps/heros/herowithimage/herowithimage.component';
import { ColumnswithiconsComponent } from './components/plateformeComps/features/columnswithicons/columnswithicons.component';
import { CustomcardsComponent } from './components/plateformeComps/features/customcards/customcards.component';
import { HeadingsComponent } from './components/plateformeComps/others/headings/headings.component';
import { HeadingleftwithimageComponent } from './components/plateformeComps/others/headingleftwithimage/headingleftwithimage.component';
import { HeadingrightwithimageComponent } from './components/plateformeComps/others/headingrightwithimage/headingrightwithimage.component';
import { HomeplateformeComponent } from './pages/homeplateforme/homeplateforme.component';
import {MatIconModule} from '@angular/material/icon';
import { AlbumComponent } from './components/plateformeComps/others/album/album.component';


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
    CenteredheroComponent,
    VerticallycenteredheroComponent,
    HerowithimageComponent,
    ColumnswithiconsComponent,
    CustomcardsComponent,
    HeadingsComponent,
    HeadingleftwithimageComponent,
    HeadingrightwithimageComponent,
    HomeplateformeComponent,
    AlbumComponent,

  ],
  imports: [
    MatIconModule,
    CommonModule,
    FrontofficeRoutingModule
  ]
})
export class FrontofficeModule { }
