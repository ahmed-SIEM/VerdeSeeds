import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { PlateformeService } from 'src/app/services/plateforme/plateforme.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';

import {  TypePack } from './utils/interfaces/edit-plateforme.interface';
import { EditPlateformeService } from './utils/services/edit-plateforme.service';
import { componentServcie } from 'src/app/services/plateforme/component.service';

interface ComponentContent {
  type: string;
  [key: string]: any; // Allow additional dynamic fields
}

interface ContentJson {
  header: ComponentContent;
  [key: string]: ComponentContent; // Allow dynamic keys for components
}

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgFor
  ]
})
export class EditPlateformeComponent implements OnInit {


  headerelements = [];
components = []
  currentStep: number = 1;
  currentModal: string | null = null;
  readonly MAX_SELECTIONS = 3; 
  readonly MINIMUM_SELECTIONS = 3; 

  platformForm: FormGroup;
  isEditMode = false;
  platformId: number | null = null;
  typePackOptions = Object.values(TypePack);
  users: any[] = [];
  isLoading = false;
  selectedPlateforme: any = null;
  contentJson: ContentJson = { header: { type: '' } }; // Ensure header is always initialized
  UserComponents: any[] = [];

  constructor(
    private fb: FormBuilder,
    private ps: PlateformeService,
    private componentservice: componentServcie,
    private us: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private editService: EditPlateformeService
  ) {
    this.platformForm = this.editService.initializeForm(fb);

    this.platformForm.valueChanges.subscribe(() => {
      this.contentJson = this.editService.updateContentJson(this.platformForm.value);
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
      this.platformForm.get('agriculteur')?.setValidators(Validators.required);
    }
    this.platformForm.get('agriculteur')?.updateValueAndValidity();
  }


  loadComponents(id: number) {
      console.log('Loading components for user ID:', id);
      this.componentservice.getAllcomponentsbyuserid(id).subscribe({
        next: (data) => {
          this.UserComponents = data;
          console.log('User Components loaded:', this.UserComponents);
        },
        error: (error) => {
          console.error('Error loading user components:', error);
        }
      });
   
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

        if (platform.content) {
          try {
            const parsedContent = JSON.parse(platform.content);
            this.contentJson = parsedContent;

            this.platformForm.patchValue({
              field1: parsedContent.header?.type || '',
              field2: parsedContent.component1?.type || '',
              field3: parsedContent.component2?.type || '',
              field4: parsedContent.component3?.type || '',
           
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
    // console.log('Form validity:', this.platformForm.valid);
    // console.log('Selection count:', this.getSelectionCount());
    // console.log('Content JSON:', this.contentJson);

    if (this.platformForm.valid && this.getSelectionCount() >= this.MINIMUM_SELECTIONS) {
      const platformData = { ...this.platformForm.value };

      this.us.getUserByEmail(platformData.agriculteur).subscribe({
        next: (user) => {
          platformData.agriculteur = user;

          if (this.isEditMode) {
            platformData.idPlateforme = this.platformId;
          }


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
      console.warn('Form validation failed. Checking invalid fields...');
      this.editService.markFormGroupTouched(this.platformForm);

      Object.keys(this.platformForm.controls).forEach((key) => {
        const control = this.platformForm.get(key);
        if (control?.invalid) {
          console.warn(`Field "${key}" is invalid. Errors:`, control.errors);
        }
      });

      if (this.getSelectionCount() < this.MINIMUM_SELECTIONS) {
        console.warn(`Minimum selection requirement not met. Selected: ${this.getSelectionCount()}, Required: ${this.MINIMUM_SELECTIONS}`);
      }
    }
  }

  onCancel() {
    this.router.navigate(['/backoffice/platform']);
  }

  goToStep(step: number): void {
    if (step === 1) {

      this.currentStep = step;





    } else if (step === 2) {
      this.loadComponents(this.platformForm.get('agriculteur')?.value.id || 0); 

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
      }


    }  else if (step === 3) {
      this.currentStep = step;
    }
  }

  getSelectionCount(): number {
    const count = this.editService.getSelectionCount(this.platformForm);
    return count;
  }

  isSelectionLimitReached(): boolean {
    return this.editService.isSelectionLimitReached(this.platformForm);
  }

  openModal(type: string): void {
    const fieldNumber = parseInt(type.replace('component', '')) + 1;
    const fieldValue = this.platformForm.get(`field${fieldNumber}`)?.value;
    
    if (!this.isSelectionLimitReached() || fieldValue) {
      this.currentModal = type;
    }
  }

  closeModal(): void {
    this.contentJson = this.editService.updateContentJson(this.platformForm.value);
    this.platformForm.get('content')?.setValue(JSON.stringify(this.contentJson));
    this.currentModal = null;
  }

  clearSelections() {
    const header = {
      type: this.platformForm.get('field1')?.value || '', // Ensure type is always a string
    };

    for (let i = 2; i <= 4; i++) {
      this.platformForm.patchValue({
        [`field${i}`]: '',
      });
    }

    this.contentJson = {
      header: header, // Ensure header is always valid
    };

    this.platformForm.get('content')?.setValue(JSON.stringify(this.contentJson));
  }

  getSelectedItems(): { key: string, label: string, value: any }[] {
    return this.editService.getSelectedItems(this.contentJson);
  }

  getSortableItems(): { key: string, label: string, value: any }[] {
    return this.editService.getSortableItems(this.contentJson);
  }

  reorderItems(): void {
    const sortedKeys = this.getSortedComponentKeys();
    const newContent: ContentJson = {
      header: this.contentJson.header, // Preserve the header
    };

    sortedKeys.forEach((key, index) => {
      const componentKey = `component${index + 1}`;
      newContent[componentKey] = { ...this.contentJson[key] }; // Reassign components in sorted order
    });

    this.contentJson = newContent;
    this.platformForm.get('content')?.setValue(JSON.stringify(this.contentJson), { emitEvent: false });
  }

  moveItemUp(index: number): void {
    const sortedKeys = this.getSortedComponentKeys();
    if (index > 0) {
      [sortedKeys[index - 1], sortedKeys[index]] = [sortedKeys[index], sortedKeys[index - 1]]; // Swap items
      this.updateContentJsonOrder(sortedKeys);
    }
  }

  moveItemDown(index: number): void {
    const sortedKeys = this.getSortedComponentKeys();
    if (index < sortedKeys.length - 1) {
      [sortedKeys[index], sortedKeys[index + 1]] = [sortedKeys[index + 1], sortedKeys[index]]; // Swap items
      this.updateContentJsonOrder(sortedKeys);
    }
  }

  updateContentJsonOrder(sortedKeys: string[]): void {
    const newContent: ContentJson = {
      header: this.contentJson.header, // Preserve the header
    };

    sortedKeys.forEach((key, index) => {
      const componentKey = `component${index + 1}`;
      newContent[componentKey] = { ...this.contentJson[key] }; // Reassign components in sorted order
    });

    this.contentJson = newContent;
    this.platformForm.get('content')?.setValue(JSON.stringify(this.contentJson), { emitEvent: false });
  }

  

  getFieldValue(componentType: string, fieldName: string): string {
    return this.contentJson[componentType]?.[fieldName] || ''; // Safely access fields
  }

  getSortedComponentKeys(): string[] {
    return Object.keys(this.contentJson)
      .filter(key => key.startsWith('component')) // Only include component keys
      .sort((a, b) => parseInt(a.replace('component', ''), 10) - parseInt(b.replace('component', ''), 10)); // Sort by component number
  }
}