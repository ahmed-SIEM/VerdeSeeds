import { Component } from '@angular/core';
import { Input } from '@angular/core';
@Component({
  selector: 'app-verticallycenteredhero',
  templateUrl: './verticallycenteredhero.component.html',
  styleUrls: ['./verticallycenteredhero.component.css']
})
export class VerticallycenteredheroComponent {
@Input() title: string = 'Centered Hero Title';
@Input() subtitle: string = 'Centered Hero Subtitle';
@Input() color: string = "#cd0000";

}
