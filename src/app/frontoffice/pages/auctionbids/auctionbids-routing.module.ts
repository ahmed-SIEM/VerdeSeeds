import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BidslistComponent } from './bidslist/bidslist.component';
import { BidsformComponent } from './bidsform/bidsform.component';

const routes: Routes = [
    { path: '', component: BidslistComponent },
    { path: 'new', component: BidsformComponent },

  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuctionbidsRoutingModule { }
