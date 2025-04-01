import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-headingleftwithimage',
  templateUrl: './headingleftwithimage.component.html',
  styleUrls: ['./headingleftwithimage.component.css']
})
export class HeadingleftwithimageComponent {
  @Input() heading!: string;
  @Input() imageUrl!: string;
  @Input() description!: string;
  @Input() backgroundColor!: string;
}
