import { Component } from '@angular/core';
import { Input } from '@angular/core';
@Component({
  selector: 'app-herowithimage',
  templateUrl: './herowithimage.component.html',
  styleUrls: ['./herowithimage.component.css'],
  standalone: true
})
export class HerowithimageComponent {
  @Input() title: string = 'Centered Hero Title';
  @Input() subtitle: string = 'Centered Hero Subtitle';
  @Input() imageUrl: string = 'https://picsum.photos/200/'; 
  @Input() color: string = "#cd0000";

}
