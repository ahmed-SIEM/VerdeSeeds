import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuctionbidsRoutingModule } from './auctionbids-routing.module';
import { BidslistComponent } from './bidslist/bidslist.component';
import { BidsformComponent } from './bidsform/bidsform.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BidslistComponent,
    BidsformComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AuctionbidsRoutingModule
  ]
})
export class AuctionbidsModule { }
