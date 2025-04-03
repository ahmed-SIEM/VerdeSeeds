import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.css']
})
export class NewsletterComponent {
  @Input() titleA: string = 'Default Newsletter Title';
  @Input() titleB: string = 'Default Newsletter Subtitle';
  @Input() titleC: string = 'Default Newsletter Subtitle';
  @Input() Image: string = 'Default Newsletter Subtitle';

  @Input() color: string = '#000000';
}
