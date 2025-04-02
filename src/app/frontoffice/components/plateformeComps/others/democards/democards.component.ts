import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-democards',
  templateUrl: './democards.component.html',
  styleUrls: ['./democards.component.css']
})
export class DemocardsComponent {
  @Input() title: string = 'Default Demo Cards Title';
  @Input() cards: { title: string; description: string; imageUrl: string }[] = [];
  @Input() color: string = '#000000';
}
