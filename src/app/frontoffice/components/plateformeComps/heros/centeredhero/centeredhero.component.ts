import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-centeredhero',
  templateUrl: './centeredhero.component.html',
  styleUrls: ['./centeredhero.component.css']
})
export class CenteredheroComponent {
  @Input() title!: string;
  @Input() subtitle!: string;
  @Input() backgroundColor!: string;
}
