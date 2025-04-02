import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-headingleftwithimage',
  templateUrl: './headingleftwithimage.component.html',
  styleUrls: ['./headingleftwithimage.component.css']
})
export class HeadingleftwithimageComponent {
  @Input() title: string = 'Heading Left with Image Title';
  @Input() subtitle: string = 'Heading Left with Image Subtitle';
  @Input() imageUrl: string = 'https://picsum.photos/200/';
  @Input() color: string = "#cd0000";

}
