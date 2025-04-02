import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-carrousel',
  templateUrl: './carrousel.component.html',
  styleUrls: ['./carrousel.component.css']
})
export class CarrouselComponent {
  @Input() title: string = 'Default Carrousel Title';
  @Input() images: string[] = [];
  @Input() color: string = '#000000';
}
