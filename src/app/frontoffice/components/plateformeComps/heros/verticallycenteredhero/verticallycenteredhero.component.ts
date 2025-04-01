import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-verticallycenteredhero',
  templateUrl: './verticallycenteredhero.component.html',
  styleUrls: ['./verticallycenteredhero.component.css']
})
export class VerticallycenteredheroComponent {
  @Input() imageUrl!: string;
  @Input() text!: string;
  @Input() textColor!: string;
}
