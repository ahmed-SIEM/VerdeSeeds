import { Component } from '@angular/core';
import { Input } from '@angular/core';
@Component({
  selector: 'app-plateformeabout',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  standalone: true
})
export class plateformeaboutComponent {
 

  @Input () title1: string = 'Default About Us Title';
  @Input () title2: string = 'Default About Us Subtitle';
  @Input () description: string = 'Default About Us Description';
  @Input () imageUrl: string = 'https://picsum.photos/400/300';
  @Input () color: string = '#000000';


}
