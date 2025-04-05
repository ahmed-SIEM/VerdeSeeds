import { Component, OnInit } from '@angular/core';
import { componentServcie } from 'src/app/services/plateforme/component.service';

@Component({
  selector: 'app-componentlist',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  components: any[] = [];

  constructor(private componentService: componentServcie) {}

  ngOnInit(): void {
    this.loadComponents();
  }

  loadComponents(): void {
    this.componentService.getComponents().subscribe(data => {
      this.components = data;
    });
  }

  deleteComponent(id: number): void {
    if (confirm('Are you sure you want to delete this component?')) {
      this.componentService.deleteComponent(id).subscribe(() => {
        this.loadComponents();
      });
    }
  }

  
}
