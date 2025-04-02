import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent {
  @Input() title: string = 'Default Album Title';
  @Input() description: string = 'Default Album Description';
  @Input() color: string = '#000000';
}
