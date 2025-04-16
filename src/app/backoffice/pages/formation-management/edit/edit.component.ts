import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Formation, FormationService } from '../services/formation.service';

@Component({
  selector: 'app-formation-edit',
  templateUrl: './edit.component.html'
})
export class EditComponent implements OnInit {
  formation: Formation = {
    idFormation: 0,
    nom: '',
    typeFormation: 'THEORIQUE',
    dateDebut: '',
    dateFin: '',
    lieu: '',
    description: '',
    certification: false,
    noteMinPourCertificat: 10,
    capacity: 3
  };

  selectedFile: File | null = null;
  isEditMode = false;
  imagePreviewUrl: string | null = null;
  today: string = new Date().toISOString().split('T')[0];

  constructor(
    private formationService: FormationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.isEditMode = true;
      this.formationService.getById(id).subscribe({
        next: (data) => this.formation = data,
        error: (err) => console.error('❌ Erreur chargement formation:', err)
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  getImagePreview(): string | null {
    return this.imagePreviewUrl || (this.formation.photoPath ? `http://localhost:8081/${this.formation.photoPath}` : null);
  }

  datesAreValid(): boolean {
    return this.formation.dateDebut <= this.formation.dateFin;
  }

  onSubmit(): void {
    if (!this.datesAreValid()) {
      alert("❌ La date de fin doit être après la date de début !");
      return;
    }

    const formData = new FormData();
    formData.append('formation', JSON.stringify(this.formation));
    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }

    const request = this.isEditMode
      ? this.formationService.update(this.formation.idFormation, formData)
      : this.formationService.create(formData);

    request.subscribe({
      next: () => {
        console.log('✅ Formation enregistrée !');
        this.router.navigate(['/backoffice/formations']);
      },
      error: (err) => {
        console.error('❌ Erreur submit:', err);
        alert("Erreur lors de l'enregistrement de la formation.");
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/backoffice/formations']);
  }
}
