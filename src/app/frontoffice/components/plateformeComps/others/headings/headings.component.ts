import { Component } from '@angular/core';
import { Input } from '@angular/core';
@Component({
  selector: 'app-headings',
  templateUrl: './headings.component.html',
  styleUrls: ['./headings.component.css'],
  standalone: true
})
export class HeadingsComponent {
@Input() Ftitle: string = 'Lorem ipsum dolor sit amet,commodo consequat.';
  @Input() Fimage: string = 'https://picsum.photos/400/300';
  @Input() Fdescription: string = 'Columns with Icons';
  @Input() Stitle: string = 'Lorem ipsum dolor sit aaduip ex ea commodo consequat.';
  @Input() Simage: string = 'https://picsum.photos/400/300';
  @Input() Sdescription: string = 'Columns with Icons';

  @Input() Ttitle: string = 'Lorem ipstrudx ea commodo consequat.';
  @Input() Timage: string = 'https://picsum.photos/400/300';
  @Input() Tdescription: string = 'Columns with Icons';
  @Input() color: string = "#cd0000";


}
