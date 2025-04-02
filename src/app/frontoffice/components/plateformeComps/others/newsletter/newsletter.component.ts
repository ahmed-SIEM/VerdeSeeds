import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.css']
})
export class NewsletterComponent {
  @Input() title: string = 'Default Newsletter Title';
  @Input() subtitle: string = 'Default Newsletter Subtitle';
  @Input() color: string = '#000000';
}
