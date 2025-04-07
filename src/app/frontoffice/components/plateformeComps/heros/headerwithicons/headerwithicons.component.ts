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
  @Input() Fimage: string = 'fa fa-th';
  @Input() Stitle: string = 'Default Stitle';
  @Input() Simage: string = 'fa fa-th';
  @Input() Ttitle: string = 'Default Stitle';
  @Input() Timage: string = 'fa fa-th';
  @Input() Ptitle: string = 'Default Faction';
  @Input() Pimage: string = 'bi-balloon';
}
