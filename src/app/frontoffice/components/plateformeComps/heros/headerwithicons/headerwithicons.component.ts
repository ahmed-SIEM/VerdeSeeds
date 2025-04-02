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
}
