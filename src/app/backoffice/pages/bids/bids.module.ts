import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BidsRoutingModule } from './bids-routing.module';
import { BidsListComponent } from './bids-list/bids-list.component';


@NgModule({
  declarations: [
    BidsListComponent
  ],
  imports: [
    CommonModule,
    BidsRoutingModule
  ]
})
export class BidsModule { }
