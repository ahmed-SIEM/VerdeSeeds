import { Component, OnInit } from '@angular/core';
import { FormationService } from '../services/formation.service';
import { Router } from '@angular/router';
import { Formation } from '../services/formation.service';

@Component({
  selector: 'app-formation-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  formations: Formation[] = [];

  constructor(
    private formationService: FormationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFormations();
  }

  loadFormations(): void {
    this.formationService.getAllWithDetails().subscribe({
      next: (data) => {
        this.formations = data;
      },
      error: (err) => {
        console.error('Erreur chargement formations avec détails:', err);
      }
    });
  }

  deleteFormation(id: number): void {
    if (confirm('Confirmer suppression de la formation ?')) {
      this.formationService.delete(id).subscribe({
        next: () => this.loadFormations(),
        error: (err) => console.error('Erreur suppression:', err)
      });
    }
  }



  
  getImagePath(photoPath: string): string {
    return `http://localhost:8081/${photoPath}`;
  }

  // ✅ Ajout du trackBy pour la performance et la stabilité
  trackById(index: number, item: Formation): number {
    return item.idFormation;
  }
}
