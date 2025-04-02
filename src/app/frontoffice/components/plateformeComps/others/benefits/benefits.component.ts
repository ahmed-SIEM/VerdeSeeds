import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-benefits',
  templateUrl: './benefits.component.html',
  styleUrls: ['./benefits.component.css']
})
export class BenefitsComponent {
  @Input() title: string = 'Default Benefits Title';
  @Input() description: string = 'Default Benefits Description';
  @Input() color: string = '#000000';
}
