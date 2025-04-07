import { Component } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-customcards',
  templateUrl: './customcards.component.html',
  styleUrls: ['./customcards.component.css'],
  standalone: true
})
export class CustomcardsComponent {
 @Input() MainTitle: string = 'Columns with Icons';

  @Input() Ftitle: string = 'Lorem ipsum dolor sit amet,commodo consequat.';
  @Input() Fimage: string = 'https://picsum.photos/400/300';

  @Input() Stitle: string = 'Lorem ipsum dolor sit aaduip ex ea commodo consequat.';
  @Input() Simage: string = 'https://picsum.photos/400/300';

  @Input() Ttitle: string = 'Lorem ipstrudx ea commodo consequat.';
  @Input() Timage: string = 'https://picsum.photos/400/300';
  @Input() color: string = "#cd0000";

}
