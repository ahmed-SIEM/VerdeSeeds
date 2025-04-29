import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuctionRoutingModule } from './auction-routing.module';
import { AuctionListComponent } from './auction-list/auction-list.component';
import { AuctionFormComponent } from './auction-form/auction-form.component';

@NgModule({
  declarations: [
    AuctionListComponent,
    AuctionFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuctionRoutingModule,
  ],
})
export class AuctionModule {}