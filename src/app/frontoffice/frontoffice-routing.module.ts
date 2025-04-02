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

const routes: Routes = [
  {
    path: '',
    component : LayoutsComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
       {path : 'hometest', component : HomeplateformeComponent},
      {path : 'home', component : HomeComponent},
      {path : 'about', component : AboutComponent},
      {path : 'contact', component : ContactComponent},
      {path : 'farmingpractice', component : FarmingPracticeComponent},
      {path : 'news', component : NewsComponent},
      {path : 'newsdetails', component : NewsdetailsComponent},
      {path : 'ourproduct', component : OurproductComponent},
      {path : 'shop', component : ShopComponent},
      {path : 'error', component : ErrorComponent}
    ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontofficeRoutingModule { 
  
}
