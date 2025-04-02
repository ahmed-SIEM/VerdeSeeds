import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-centeredhero',
  templateUrl: './centeredhero.component.html',
  styleUrls: ['./centeredhero.component.css']
})
export class CenteredheroComponent {
@Input() title: string = 'Centered Hero Title';
@Input() subtitle: string = 'Centered Hero Subtitle';
@Input() imageUrl: string = 'https://picsum.photos/400/300'; 
@Input() color: string = "#cd0000";
}
