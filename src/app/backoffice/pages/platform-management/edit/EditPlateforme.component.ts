import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { PlateformeService } from 'src/app/services/plateforme/plateforme.service';

@Component({
  selector: 'app-edit-plateforme',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditPlateformeComponent implements OnInit {

  currentStep: number = 1; // Track the current step

  TypePack = {
    BASIC : 'BASIC',
    PREMIUM : 'PREMIUM',
    ADVANCED : 'ADVANCED'
  }
  platformForm: FormGroup;
  isEditMode = false;
  platformId: number | null = null;
  typePackOptions = Object.values(this.TypePack);
  users: any[] = [];
  isLoading = false;
  selectedPlateforme: any = null;
  contentJson: any = {}; // Track the current content JSON dynamically

  constructor(
    private fb: FormBuilder,
    private ps: PlateformeService,
    private us: CommonService,
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
      agriculteur: [null],
      field1: ['', Validators.required], 
      field2: ['', Validators.required],
      field3: ['', Validators.required], 
      field4: ['', Validators.required], 
      field5: ['', Validators.required], 
      field6: ['', Validators.required] 
    });

    // Update contentJson dynamically based on other fields
    this.platformForm.valueChanges.subscribe(() => {
      const { field1, field2, field3, field4, field5, field6 } = this.platformForm.value;
      this.contentJson = {
        choice: field1 || null,
        numerical: field2 || null,
        animal: field3 || null,
        letter: field4 || null,
        color: field5 || null,
        fruit: field6 || null
      };
      this.platformForm.get('content')?.setValue(JSON.stringify(this.contentJson), { emitEvent: false });
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
      // Add required validator for 'agriculteur' in create mode
      this.platformForm.get('agriculteur')?.setValidators(Validators.required);
    }
    this.platformForm.get('agriculteur')?.updateValueAndValidity();
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

        // Parse and set the stored content JSON
        if (platform.content) {
          try {
            const parsedContent = JSON.parse(platform.content);
            this.contentJson = parsedContent;

            // Set the values for the radio fields
            this.platformForm.patchValue({
              field1: parsedContent.choice || '',
              field2: parsedContent.numerical || '',
              field3: parsedContent.animal || '',
              field4: parsedContent.letter || '',
              field5: parsedContent.color || '',
              field6: parsedContent.fruit || ''
            });
          } catch (error) {
            console.error('Error parsing content JSON:', error);
          }
        }

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
      const platformData = { ...this.platformForm.value };
      console.log('Form data before submission:', platformData);
  
      this.us.getUserByEmail(platformData.agriculteur).subscribe({
        next: (user) => {
          platformData.agriculteur = user;
  
          // Ajoute l'idPlateforme seulement si c’est un update
          if (this.isEditMode) {
            platformData.idPlateforme = this.platformId;
          }
  
          console.log('Form data before sending to backend:', platformData);
  
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
        },
        error: (error) => {
          console.error('Error fetching user by email:', error);
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

  goToStep(step: number): void {
    if (step === 1) {
      this.currentStep = step;
    } else if (step === 2) {
      // Validate only step 1 fields
      const step1Fields = ['nomPlateforme', 'typePack', 'couleur', 'description', 'dateCreation', 'valabilite', 'logo', 'updateTheme', 'agriculteur'];
      let isStep1Valid = true;

      step1Fields.forEach(field => {
        const control = this.platformForm.get(field);
        if (control) {
          control.markAsTouched();
          if (control.invalid) {
            isStep1Valid = false;
          }
        }
      });

      if (isStep1Valid) {
        this.currentStep = step;
      } else {
        console.log('Step 1 is invalid, fields marked as touched');
      }
    }
  }
}
