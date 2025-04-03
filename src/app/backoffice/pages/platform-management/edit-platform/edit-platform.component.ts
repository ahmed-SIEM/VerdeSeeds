import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlateformeService } from 'src/app/services/plateforme/plateforme.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-edit-platform',
  templateUrl: './edit-platform.component.html',
  styleUrls: ['./edit-platform.component.css']
})
export class EditPlatformComponent implements OnInit {
  plateforme: any = { nom: '', description: '' };
  isEditMode = false;
  users: any[] = []; // List of available users

  constructor(
    private ps: PlateformeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ps.getAvailableUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Erreur lors de la récupération des utilisateurs', err)
    });

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.ps.getPlateforms().subscribe({
        next: (data) => this.plateforme = data.find((p: any) => p.id === +id),
        error: () => this.router.navigate(['/backoffice/platform-management'])
      });
    }
  }

  onSubmit(): void {
    const operation = this.isEditMode
      ? this.ps.updatePlateforme(this.plateforme.id, this.plateforme)
      : this.ps.createPlateforme(this.plateforme);

    operation.subscribe({
      next: () => this.router.navigate(['/backoffice/platform-management']),
      error: (err) => console.error('Erreur lors de l\'enregistrement de la plateforme', err)
    });
  }
}
