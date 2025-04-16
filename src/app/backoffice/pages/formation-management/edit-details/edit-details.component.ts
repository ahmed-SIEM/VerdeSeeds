import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailsFormationDTO, DetailsFormationService } from '../services/Detailsformation.service';

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
    const idDetaille = this.route.snapshot.paramMap.get('idDetaille');
    const idFormation = this.route.snapshot.paramMap.get('idFormation');

    if (idDetaille) {
      // 🛠️ Mode ÉDITION
      const id = +idDetaille;
      console.log('🧩 Mode édition - ID détail :', id);

      this.detailService.getById(id).subscribe({
        next: (data) => {
          this.detail = data;
          this.isEditMode = true;
          console.log('✅ Données chargées pour modification :', this.detail);
        },
        error: (err) => {
          console.error('❌ Erreur chargement détail (édition)', err);
          this.router.navigate(['/backoffice/formations']);
        }
      });

    } else if (idFormation) {
      // ✨ Mode AJOUT
      const id = +idFormation;
      console.log('🆕 Mode ajout - ID formation :', id);
      this.detail.idFormation = id;
      this.isEditMode = false;
    } else {
      console.error('❌ Aucun ID valide trouvé dans l’URL');
      this.router.navigate(['/backoffice/formations']);
    }
  }

  onSubmit(): void {
    console.log('📤 Soumission du formulaire...', this.detail);

    if (this.isEditMode && this.detail.idDetaille) {
      this.detailService.update(this.detail.idDetaille, this.detail).subscribe({
        next: () => {
          console.log('✅ Détail modifié avec succès !');
          this.router.navigate(['/backoffice/formations']);
        },
        error: (err) => {
          console.error('❌ Erreur modification', err);
        }
      });
    } else {
      this.detailService.add(this.detail).subscribe({
        next: () => {
          console.log('✅ Détail ajouté avec succès !');
          this.router.navigate(['/backoffice/formations']);
        },
        error: (err) => {
          console.error('❌ Erreur ajout', err);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/backoffice/formations']);
  }
}
