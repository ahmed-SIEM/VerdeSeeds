import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-verticallycenteredhero',
  templateUrl: './verticallycenteredhero.component.html',
  styleUrls: ['./verticallycenteredhero.component.css'],
  standalone: true
})
export class VerticallycenteredheroComponent {
  @Input() title: string = 'Default Title';
  @Input() subtitle: string = 'Default Subtitle';
  @Input() color: string = '#000000';
}
