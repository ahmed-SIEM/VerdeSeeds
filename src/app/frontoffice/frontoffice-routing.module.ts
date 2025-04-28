import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { FarmingPracticeComponent } from './pages/farming-practice/farming-practice.component';
import { NewsComponent } from './pages/news/news.component';
import { NewsdetailsComponent } from './pages/newsdetails/newsdetails.component';
import { OurproductComponent } from './pages/ourproduct/ourproduct.component';
import { ShopComponent } from './pages/shop/shop.component';
import { ErrorComponent } from '../error/error.component';
import { LayoutsComponent } from './layouts/layouts.component';
import { HomeplateformeComponent } from './pages/homeplateforme/homeplateforme.component';
import { PlatformeComponent } from './pages/platforme/platforme.component';
import { DetailsformationComponent } from './pages/detailsformation/detailsformation.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { CalendarComponent } from './pages/shop/calendar/calendar.component';
import { ArticleAuctionComponent } from './pages/article-auction/article-auction.component';
import { BidsListComponent } from '../backoffice/pages/bids/bids-list/bids-list.component';
import { BidsformComponent } from './pages/auctionbids/bidsform/bidsform.component';


const routes: Routes = [
  {
    path: '',
    component: LayoutsComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'hometest', component: HomeplateformeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'farmingpractice', component: FarmingPracticeComponent },
      { path: 'details/:id', component: DetailsformationComponent },
      { path: 'news', component: NewsComponent },
      { path: 'newsdetails', component: NewsdetailsComponent },
      { path: 'ourproduct', component: OurproductComponent },
      { path: 'shop', component: ShopComponent },
      { path: 'articleauction', component: ArticleAuctionComponent },
      { path: 'shop/article/:articleId/calendar', component: CalendarComponent },
      { path: 'bids/auction/:auctionId', component: BidsListComponent },
      { path: 'bids/auction/:auctionId/new', component: BidsformComponent },
      { path: 'Platforme', component: PlatformeComponent },
      { path: 'signup', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: '**', component: ErrorComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontofficeRoutingModule { 
  
}
