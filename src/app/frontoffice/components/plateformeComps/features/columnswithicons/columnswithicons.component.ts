import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { OnInit } from '@angular/core';


@Component({
  selector: 'app-columnswithicons',
  templateUrl: './columnswithicons.component.html',
  styleUrls: ['./columnswithicons.component.css'],
  standalone: true
})
export class ColumnswithiconsComponent {

  @Input() MainTitle: string = 'Columns with Icons';

  @Input() Ftitle: string = 'Lorem ipsum dolor sit amet,commodo consequat.';
  @Input() Fdescription: string = 'Lorem ipsum dolor sit amet, consectetur adipiscing eli ex ea commodo consequat.';
  @Input() Ficon: string = 'bi bi-0-circle';

  @Input() Stitle: string = 'Lorem ipsum dolor sit aaduip ex ea commodo consequat.';
  @Input() Sdescription: string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sedonliquip ex ea commodo consequat.';
  @Input() Sicon: string = 'bi bi-0-circle';

  @Input() Ttitle: string = 'Lorem ipstrudx ea commodo consequat.';
  @Input() Tdescription: string = 'Lorem ipsum dolea commodo consequat.';
  @Input() Ticon: string = 'bi bi-0-circle';
  @Input() color: string = "#cd0000";
 

}
