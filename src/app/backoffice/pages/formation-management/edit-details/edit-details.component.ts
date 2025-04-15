import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailsFormationDTO, DetailsFormationService } from '../services/DetailsFormation.service';

@Component({
  selector: 'app-edit-details',
  templateUrl: './edit-details.component.html',
  styleUrls: ['./edit-details.component.css']
})
export class EditDetailsComponent implements OnInit {
  isEditMode = false;

  detail: DetailsFormationDTO = {
    objectif: '',
    contenu: '',
    duree: 0,
    materielRequis: '',
    idFormation: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private detailService: DetailsFormationService
  ) {}

  ngOnInit(): void {
    const idDetaille = this.route.snapshot.paramMap.get('id');
    if (idDetaille) {
      const id = +idDetaille;
      console.log('🧩 Chargement détail ID:', id);

      this.detailService.getById(id).subscribe({
        next: (data) => {
          if (data) {
            console.log('✅ Données chargées:', data);
            this.detail = data;
            this.isEditMode = true;
          } else {
            console.warn('⚠️ Détail introuvable, passage en ajout');
            this.isEditMode = false;
          }
        },
        error: (err) => {
          console.error('❌ Erreur chargement:', err);
          this.isEditMode = false;
        }
      });
    }
  }

  onSubmit(): void {
    if (this.isEditMode && this.detail.idDetaille) {
      this.detailService.update(this.detail.idDetaille, this.detail).subscribe({
        next: () => this.router.navigate(['/backoffice/formations']),
        error: (err) => console.error('❌ Erreur maj détail:', err)
      });
    } else {
      this.detailService.add(this.detail).subscribe({
        next: () => this.router.navigate(['/backoffice/formations']),
        error: (err) => console.error('❌ Erreur ajout détail:', err)
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/backoffice/formations']);
  }
}
