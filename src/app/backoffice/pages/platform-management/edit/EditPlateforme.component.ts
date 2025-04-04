import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlateformeService } from 'src/app/services/plateforme/plateforme.service';

@Component({
  selector: 'app-edit-plateforme',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditPlateformeComponent implements OnInit {

  TypePack = {
    BASIC : 'BASIC',
    PREMIUM : 'PREMIUM',
    ENTERPRISE : 'ENTERPRISE'
  }
  platformForm: FormGroup;
  isEditMode = false;
  platformId: number | null = null;
  typePackOptions = Object.values(this.TypePack);
  users: any[] = [];
  isLoading = false;
  selectedPlateforme: any = null;

  constructor(
    private fb: FormBuilder,
    private ps: PlateformeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.platformForm = this.fb.group({
      nomPlateforme: ['', [Validators.required, Validators.minLength(3)]],
      typePack: ['', Validators.required],
      couleur: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      dateCreation: ['', Validators.required],
      valabilite: ['', Validators.required],
      logo: ['', Validators.required],
      updateTheme: ['', Validators.required],
      content: ['', Validators.required],
      //agriculteur: [null, Validators.required]
    });
  }

  ngOnInit() {

    this.loadUsers();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.platformId = +id;
      this.loadPlatform(this.platformId);

    } else {
      const today = new Date();
      this.platformForm.patchValue({
        dateCreation: today.toISOString().split('T')[0],
        valabilite: new Date(today.setMonth(today.getMonth() + 12)).toISOString().split('T')[0]
      });
    }
  }

  loadUsers() {
    this.ps.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        console.log('Users loaded:', this.users);
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  loadPlatform(id: number) {
    this.isLoading = true;
    this.ps.getPlateforme(id).subscribe({
      next: (platform) => {
        this.selectedPlateforme = platform;
        this.platformForm.patchValue({
          ...platform,
          dateCreation: platform.dateCreation.split('T')[0],
          valabilite: platform.valabilite.split('T')[0]
        });
        this.isLoading = false;

      },
      error: (error) => {
        console.error('Error loading platform:', error);
        this.isLoading = false;
      }
    });
  }

  onSubmit() {

    if (this.platformForm.valid) {
      const platformData = this.platformForm.value;
      platformData.idPlateforme = this.platformId;
      console.log('Form submitted:', platformData);
      console.log("current mode is edit ? :",this.isEditMode);
      
      const operation = this.isEditMode
        ? this.ps.updatePlateforme(platformData)
        : this.ps.createPlateforme(platformData);

      operation.subscribe({
        next: () => {
           this.router.navigate(['/backoffice/platform']);
        },
        error: (error) => {
          console.error('Error saving platform:', error);
        }
      });
    } else {
      this.markFormGroupTouched(this.platformForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onCancel() {
    this.router.navigate(['/backoffice/platform']);
  }
}
