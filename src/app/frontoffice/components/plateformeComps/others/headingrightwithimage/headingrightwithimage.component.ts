import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-headingrightwithimage',
  templateUrl: './headingrightwithimage.component.html',
  styleUrls: ['./headingrightwithimage.component.css']
})
export class HeadingrightwithimageComponent {
  @Input() heading!: string;
  @Input() imageUrl!: string;
  @Input() description!: string;
  @Input() backgroundColor!: string;
}
