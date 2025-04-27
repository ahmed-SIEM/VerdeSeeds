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

// ✅ Auth Components
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';

// ✅ Mat & Calendar modules
import { MatIconModule } from '@angular/material/icon';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DetailsformationComponent } from './pages/detailsformation/detailsformation.component';
import { CalendarComponent } from './pages/shop/calendar/calendar.component';
import { ArticleAuctionComponent } from './pages/article-auction/article-auction.component';
import { BidslistComponent } from './pages/auctionbids/bidslist/bidslist.component';
import { BidsformComponent } from './pages/auctionbids/bidsform/bidsform.component';

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
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    CalendarComponent,
    ArticleAuctionComponent,
    BidslistComponent,
    BidsformComponent,
    
  ],
  imports: [
    CommonModule,
    HttpClientModule, // ✅ Pour les requêtes HTTP
    FrontofficeRoutingModule,
    RouterModule,
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
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class FrontofficeModule { }