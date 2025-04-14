import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { componentServcie } from 'src/app/services/plateforme/component.service';

@Component({
  selector: 'app-componentdetails',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  component: any;

  constructor(
    private componentService: componentServcie,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.componentService.getComponent(+id).subscribe(data => {
        this.component = data;
      });
    }
  }

  
}
