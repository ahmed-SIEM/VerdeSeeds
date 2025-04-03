import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PlateformeService } from 'src/app/services/plateforme/plateforme.service';
@Component({
  selector: 'app-Plateformelist',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListPlateformeComponent {
  plateformes: any[] = [];
  users: any[] = [];
  selectedPlateforme: any = null;

  constructor(private ps: PlateformeService, private router: Router) {}

  ngOnInit() {
    this.loadPlateformes();
    this.loadUsers();
  }

  loadPlateformes() {
    this.ps.getPlateforms().subscribe({
      next: (data) => {
        this.plateformes = data;
        console.log('plateformes récupérés :', this.plateformes);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des plateformes', error);
      }
    });
  }

  loadUsers() {
    this.ps.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des utilisateurs', error);
      }
    });
  }

  createOrUpdatePlateforme(): void {
    if (this.selectedPlateforme.idPlateforme) {
      this.ps.updatePlateforme(this.selectedPlateforme.idPlateforme, this.selectedPlateforme).subscribe({
        next: () => this.loadPlateformes(),
        error: (err) => console.error('Erreur lors de la mise à jour de la plateforme', err)
      });
    } else {
      this.ps.createPlateforme(this.selectedPlateforme).subscribe({
        next: () => this.loadPlateformes(),
        error: (err) => console.error('Erreur lors de la création de la plateforme', err)
      });
    }
    this.selectedPlateforme = null;
  }

  editPlateforme(plateforme: any): void {
    this.selectedPlateforme = { ...plateforme };
  }

  deletePlateforme(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette plateforme ?')) {
      this.ps.deletePlateforme(id).subscribe({
        next: () => this.loadPlateformes(),
        error: (err) => console.error('Erreur lors de la suppression de la plateforme', err)
      });
    }
  }

  navigateToEdit(id: number): void {
    this.router.navigate([`/backoffice/platform/${id}/edit`]);
  }

  navigateToCreate(): void {
    this.router.navigate(['/backoffice/platform/new']);
  }
}

