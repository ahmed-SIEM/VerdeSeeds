import { Component, OnInit } from '@angular/core';
import { PlateformeService } from 'src/app/services/plateforme/plateforme.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-platform-management',
  templateUrl: './platform-management.component.html',
  styleUrls: ['./platform-management.component.css']
})
export class PlatformManagementComponent implements OnInit {
  plateformes: any[] = [];

  constructor(private ps: PlateformeService, private router: Router) {}

  ngOnInit() {
    this.ps.getPlateforms().subscribe({
      next: (data) => {
        this.plateformes = data;
        console.log('plteformes récupérés :', this.plateformes);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des plteformes', error);
      }
    });
  }

  deletePlateforme(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette plateforme ?')) {
      this.ps.deletePlateforme(id).subscribe({
        next: () => this.ngOnInit(),
        error: (err) => console.error('Erreur lors de la suppression de la plateforme', err)
      });
    }
  }

  navigateToEdit(id: number): void {
    this.router.navigate([`/backoffice/platform-management/${id}/edit`]);
  }

  navigateToCreate(): void {
    this.router.navigate(['/backoffice/platform-management/new']);
  }
}
