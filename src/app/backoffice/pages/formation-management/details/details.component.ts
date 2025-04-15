import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Formation, FormationService } from '../services/formation.service';
import { DetailsFormationService } from '../services/DetailsFormation.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  formation?: Formation;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formationService: FormationService,
    private detailService: DetailsFormationService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    if (!id) {
      this.router.navigate(['/backoffice/formations']);
      return;
    }

    this.formationService.getByIdWithDetails(id).subscribe({
      next: (data) => {
        this.formation = data;

        // ✅ Vérifie que l’ID de détail est bien reçu
        console.log('🧩 ID du détail reçu :', this.formation.detailFormation?.idDetaille);

        this.isLoading = false;
      },
      error: (err) => {
        console.error("Erreur chargement formation avec détails :", err);
        this.router.navigate(['/backoffice/formations']);
      }
    });
  }

  onEdit(): void {
    if (this.formation?.detailFormation?.idDetaille) {
      // ✅ Envoie l’idDetaille et non l’idFormation
      this.router.navigate(['/backoffice/formations/edit-details', this.formation.detailFormation.idDetaille]);
    } else {
      console.warn('⚠️ Aucun détail associé à cette formation !');
    }
  }
  

  onDelete(): void {
    const id = this.formation?.detailFormation?.idDetaille;

    if (id && confirm('Voulez-vous supprimer les détails ?')) {
      console.log('🗑️ Suppression du détail ID :', id);

      this.detailService.delete(id).subscribe({
        next: () => {
          console.log('✅ Suppression réussie !');
          this.router.navigate(['/backoffice/formations']);
        },
        error: (err) => {
          console.error('❌ Erreur suppression :', err);
        }
      });
    } else {
      console.warn("⚠️ Aucune ID détectée ou suppression annulée !");
    }
  }
}
