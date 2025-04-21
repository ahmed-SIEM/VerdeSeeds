import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FrontofficeRoutingModule } from './frontoffice-routing.module';

// ✅ Components généraux
import { LayoutsComponent } from './layouts/layouts.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ErrorFrontComponent } from './components/error-front/error-front.component';

// ✅ Pages principales
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { FarmingPracticeComponent } from './pages/farming-practice/farming-practice.component';
import { HomeComponent } from './pages/home/home.component';
import { NewsdetailsComponent } from './pages/newsdetails/newsdetails.component';
import { NewsComponent } from './pages/news/news.component';
import { OurproductComponent } from './pages/ourproduct/ourproduct.component';
import { ShopComponent } from './pages/shop/shop.component';
import { HomeplateformeComponent } from './pages/homeplateforme/homeplateforme.component';
import { PlatformeComponent } from './pages/platforme/platforme.component';
import { CalendarPopupComponent } from './pages/farming-practice/calendar-popup/calendar-popup.component';

// ✅ Mat & Calendar modules
import { MatIconModule } from '@angular/material/icon';
import { FullCalendarModule } from '@fullcalendar/angular'; // 📅 SUPER IMPORTANT

// ✅ Composants plateforme
import { CenteredheroComponent } from './components/plateformeComps/heros/centeredhero/centeredhero.component';
import { VerticallycenteredheroComponent } from './components/plateformeComps/heros/verticallycenteredhero/verticallycenteredhero.component';
import { HerowithimageComponent } from './components/plateformeComps/heros/herowithimage/herowithimage.component';
import { HeaderwithiconsComponent } from './components/plateformeComps/heros/headerwithicons/headerwithicons.component';
import { CustomcardsComponent } from './components/plateformeComps/features/customcards/customcards.component';
import { ColumnswithiconsComponent } from './components/plateformeComps/features/columnswithicons/columnswithicons.component';
import { HeadingsComponent } from './components/plateformeComps/others/headings/headings.component';
import { HeadingleftwithimageComponent } from './components/plateformeComps/others/headingleftwithimage/headingleftwithimage.component';
import { HeadingrightwithimageComponent } from './components/plateformeComps/others/headingrightwithimage/headingrightwithimage.component';
import { NewsletterComponent } from './components/plateformeComps/others/newsletter/newsletter.component';
import { SponsorsComponent } from './components/plateformeComps/others/sponsors/sponsors.component';
import { plateformeaboutComponent } from './components/plateformeComps/others/about/about.component';
import { FormsModule } from '@angular/forms';
import { DetailsformationComponent } from './pages/detailsformation/detailsformation.component';

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
    HomeplateformeComponent,
    PlatformeComponent,
    CalendarPopupComponent,
    DetailsformationComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule, // ✅ Pour les requêtes HTTP
    FrontofficeRoutingModule,
    MatIconModule,
    FullCalendarModule, // ✅ Pour le calendrier dynamique
    // Plateforme compos
    CenteredheroComponent,
    VerticallycenteredheroComponent,
    HerowithimageComponent,
    HeaderwithiconsComponent,
    CustomcardsComponent,
    ColumnswithiconsComponent,
    HeadingsComponent,
    HeadingleftwithimageComponent,
    HeadingrightwithimageComponent,
    NewsletterComponent,
    SponsorsComponent,
    plateformeaboutComponent,
    FormsModule,
  ]
})
export class FrontofficeModule {}
