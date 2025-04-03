import { Component } from '@angular/core';
import { Input } from '@angular/core';
@Component({
  selector: 'app-headerwithicons',
  templateUrl: './headerwithicons.component.html',
  styleUrls: ['./headerwithicons.component.css']
}) 
export class HeaderwithiconsComponent {
  @Input() title: string = 'Default Title';
  @Input() subtitle: string = 'Default Subtitle';
  @Input() color: string = '#000000';
  @Input() Ftitle: string = 'Default Ftitle';
  @Input() Fimage: string = 'fa fa-pencil ';
  @Input() Stitle: string = 'Default Stitle';
  @Input() Simage: string = 'fa fa-th';
}
