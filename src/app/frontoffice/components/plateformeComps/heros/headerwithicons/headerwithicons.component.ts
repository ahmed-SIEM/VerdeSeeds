import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-headerwithicons',
  templateUrl: './headerwithicons.component.html',
  styleUrls: ['./headerwithicons.component.css'],
  standalone: true
}) 
export class HeaderwithiconsComponent {



 

 


  @Input() title: string = 'Default Title';
  @Input() subtitle: string = 'Default Subtitle';
  @Input() color: string = 'gray';
  @Input() Ftitle: string = 'Default Ftitle';
  @Input() Ficon: string = 'fa fa-th';
  @Input() Stitle: string = 'Default Stitle';
  @Input() Sicon: string = 'fa fa-th';
  @Input() Ttitle: string = 'Default Stitle';
  @Input() Ticon: string = 'fa fa-th';
  @Input() Ptitle: string = 'Default Faction';
  @Input() Picon: string = 'bi-balloon';
}
