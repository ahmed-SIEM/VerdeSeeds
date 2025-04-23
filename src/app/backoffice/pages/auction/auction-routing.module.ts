import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuctionListComponent } from './auction-list/auction-list.component';
import { AuctionFormComponent } from './auction-form/auction-form.component';

const routes: Routes = [
  { 
    path: '', 
    component: AuctionListComponent 
  },
  { 
    path: 'create', 
    component: AuctionFormComponent 
  },
  { 
    path: 'edit/:auctionId', 
    component: AuctionFormComponent 
  },
  { 
    path: 'article/:articleId', 
    component: AuctionListComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuctionRoutingModule {}