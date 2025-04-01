import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-customcards',
  templateUrl: './customcards.component.html',
  styleUrls: ['./customcards.component.css']
})
export class CustomcardsComponent {
  @Input() cards!: { title: string; description: string; imageUrl: string }[];
}
