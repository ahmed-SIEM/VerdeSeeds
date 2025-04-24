import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BidsListComponent } from './bids-list/bids-list.component';

const routes: Routes = [
  { path: '', component: BidsListComponent },
  { path: 'article/:articleId/auction/:auctionId', component: BidsListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BidsRoutingModule { }
