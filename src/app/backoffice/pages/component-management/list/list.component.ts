import { Component, OnInit } from '@angular/core';
import { componentServcie } from 'src/app/services/plateforme/component.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-componentlist',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})




export class ListComponent implements OnInit {

  
  components: any[] = [];
  searchTerm: string = '';
  selectedPlateforme: any = null;
  constructor(private componentService: componentServcie, private router: Router) {}

  ngOnInit(): void {
    this.loadComponents();
  }


  get filteredComponentsList() {
    return this.components.filter(component => {
      const matchesSearch = !this.searchTerm || 
        component.nomComponent.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        component.description?.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesSearch;
    });
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

  editComponent(component: any): void {
    this.router.navigate(['/backoffice/component', component.id, 'edit']);
  }
  previewComponent(component: any): void {
     console.log('Previewing component:', component);
  }

  viewComponent(component: any): void {
    this.router.navigate(['/backoffice/component', component.id]);
  }


  addComponent(){
    this.router.navigate(['/backoffice/component', 'add']);

  }





  
}
