import { Component } from '@angular/core';
import { CommonService } from './services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'portal';



 constructor(private commonService: CommonService) {
     this.commonService.getUsers().subscribe((data) => {
    console.log(data);
     });
  }
}
