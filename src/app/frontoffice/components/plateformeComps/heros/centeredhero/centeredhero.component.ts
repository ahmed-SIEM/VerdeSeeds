import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-centeredhero',
  templateUrl: './centeredhero.component.html',
  styleUrls: ['./centeredhero.component.css'],
  standalone: true
})
export class CenteredheroComponent {
  @Input() title: string = 'Default Title';
  @Input() subtitle: string = 'Default Subtitle';
  @Input() imageUrl: string = 'https://picsum.photos/400/300';
  @Input() color: string = '#000000';
}
