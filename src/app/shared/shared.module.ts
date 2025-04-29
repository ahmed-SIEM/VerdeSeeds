import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseUrlPipe } from '../pipes/firebase-url.pipe';

@NgModule({
  declarations: [FirebaseUrlPipe],
  imports: [CommonModule],
  exports: [FirebaseUrlPipe]
})
export class SharedModule { }