// edit.component.ts
import { Component, OnInit } from '@angular/core';
import { FormationService } from '../services/formation.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-formation-edit',
  templateUrl: './edit.component.html'
})
export class EditComponent implements OnInit {
  formation: any = {
    nom: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    lieu: '',
    certification: false,
    typeFormation: 'THEORIQUE'
  };
  isEditMode = false;

  constructor(
    private service: FormationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.service.getById(+id).subscribe({
        next: (data) => this.formation = data,
        error: () => this.router.navigate(['/backoffice/formation-management'])
      });
    }
  }

  onSubmit(): void {
    const operation = this.isEditMode
      ? this.service.update(this.formation.id, this.formation)
      : this.service.create(this.formation);

    operation.subscribe({
      next: () => this.router.navigate(['/backoffice/formation-management']),
      error: (err) => console.error('Error saving formation', err)
    });
  }
}