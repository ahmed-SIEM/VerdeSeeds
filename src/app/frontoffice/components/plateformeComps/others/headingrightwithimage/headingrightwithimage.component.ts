import { Component } from '@angular/core';
import { Input } from '@angular/core';
@Component({
  selector: 'app-headingrightwithimage',
  templateUrl: './headingrightwithimage.component.html',
  styleUrls: ['./headingrightwithimage.component.css'],
  standalone: true
})
export class HeadingrightwithimageComponent {
  @Input() title: string = 'Heading Left with Image Title';
  @Input() subtitle: string = 'Heading Left with Image Subtitle';
  @Input() imageUrl: string = 'https://picsum.photos/200/';
  @Input() color: string = "#cd0000";

}
