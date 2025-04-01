import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-columnswithicons',
  templateUrl: './columnswithicons.component.html',
  styleUrls: ['./columnswithicons.component.css']
})
export class ColumnswithiconsComponent {
  @Input() columns!: { icon: string; text: string }[];
}
