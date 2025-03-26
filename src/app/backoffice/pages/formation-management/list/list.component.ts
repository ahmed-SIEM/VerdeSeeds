// list.component.ts
import { Component, OnInit } from '@angular/core';
import { FormationService } from '../services/formation.service';

@Component({
  selector: 'app-formation-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  formations: any[] = [];
  displayedColumns = ['nom', 'dateDebut', 'dateFin', 'actions'];
totalItems: any;

  constructor(private formationService: FormationService) {}

  ngOnInit(): void {
    this.loadFormations();
  }

  loadFormations(): void {
    this.formationService.getAll().subscribe({
      next: (data) => this.formations = data,
      error: (err) => console.error('Error loading formations', err)
    });
  }

  deleteFormation(id: number): void {
    if(confirm('Voulez-vous vraiment supprimer cette formation ?')) {
      this.formationService.delete(id).subscribe({
        next: () => this.loadFormations(),
        error: (err) => console.error('Error deleting formation', err)
      });
    }
  }
}