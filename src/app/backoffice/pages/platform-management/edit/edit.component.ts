import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { PlateformeService } from 'src/app/services/plateforme/plateforme.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { ELEMENTS_FIELDS
, featuredelements, headingelements, headerelements, otherselements ,
 MAX_SELECTIONS, MINIMUM_SELECTIONS } from './utils/constants/edit-plateforme.constants';
import {  TypePack } from './utils/interfaces/edit-plateforme.interface';
import { EditPlateformeService } from './utils/services/edit-plateforme.service';

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

  ELEMENTS_FIELDS = {
    headerwithicons: [
      "title", "subtitle", "Ftitle", "Fimage",
      "Stitle", "Simage", "Ttitle", "Timage",
      "Ptitle", "Pimage"
    ],
    centeredhero: [
      "title", "subtitle", "imageUrl"
    ],
    herowithimage: [
      "title", "subtitle", "imageUrl"
    ],
    verticallycenteredhero: [
      "title", "subtitle"
    ],
    columnswithicons: [
      "MainTitle", "Ftitle", "Fdescription", "Fimage",
      "Stitle", "Sdescription", "Simage",
      "Ttitle", "Tdescription", "Timage"
    ],
    customcards: [
      "MainTitle", "Ftitle", "Fimage",
      "Stitle", "Simage", "Ttitle", "Timage"
    ],
    headings: [
      "Ftitle", "Fdescription", "Fimage",
      "Stitle", "Sdescription", "Simage",
      "Ttitle", "Tdescription", "Timage"
    ],
    headingleftwithimage: [
      "title", "subtitle", "imageUrl"
    ],
    headingrightwithimage: [
      "title", "subtitle", "imageUrl"
    ],
    newsletter: [
      "titleA", "TextB", "TextC", "Image"
    ],
    plateformeabout: [
      "title1", "title2", "description", "imageUrl"
    ]
  };

  elementsfields = ELEMENTS_FIELDS;
  headerelements = headerelements;
components = [ featuredelements,headingelements, otherselements ]
  currentStep: number = 1;
  currentModal: string | null = null;
  readonly MAX_SELECTIONS = MAX_SELECTIONS; 
  readonly MINIMUM_SELECTIONS = MINIMUM_SELECTIONS; 

  platformForm: FormGroup;
  isEditMode = false;
  platformId: number | null = null;
  typePackOptions = Object.values(TypePack);
  users: any[] = [];
  isLoading = false;
  selectedPlateforme: any = null;
  contentJson: any = {}; 
  selectedComponent: string | null = null;

  constructor(
    private fb: FormBuilder,
    private ps: PlateformeService,
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
    if (this.platformForm.get('field1')?.value &&
      this.platformForm.valid &&
      this.getSelectionCount() <= this.MAX_SELECTIONS) {
      const platformData = { ...this.platformForm.value };
      console.log('Form data before submission:', platformData);

      this.us.getUserByEmail(platformData.agriculteur).subscribe({
        next: (user) => {
          platformData.agriculteur = user;

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
      this.editService.markFormGroupTouched(this.platformForm);
    }
  }

  onCancel() {
    this.router.navigate(['/backoffice/platform']);
  }

  goToStep(step: number): void {
    if (step === 1) {
      this.currentStep = step;
      console.log('JSON content step 1:', this.contentJson);
    } else if (step === 2) {
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

      console.log('JSON content step 2:', this.contentJson);

    } else if (step === 3) {
      if (this.platformForm.get('field1')?.valid && this.getSelectionCount() >= this.MINIMUM_SELECTIONS) {
        // Initialize content structure for header
        if (!this.contentJson.header) {
          this.contentJson.header = {
            type: this.platformForm.get('field1')?.value
          };
        }

        // Initialize content structure for components
        for (let i = 2; i <= 4; i++) {
          const componentValue = this.platformForm.get(`field${i}`)?.value;
          if (componentValue) {
            const componentKey = `component${i-1}`;
            if (!this.contentJson[componentKey]) {
              this.contentJson[componentKey] = {
                type: componentValue
              };
            }
          }
        }

        this.currentStep = step;
      }
    } else if (step === 4) {
      this.currentStep = step;
      console.log('JSON content step 4:', this.contentJson);

    }
  }

  getSelectionCount(): number {
    return this.editService.getSelectionCount(this.platformForm);
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
      type: this.platformForm.get('field1')?.value,
    };

    for (let i = 2; i <= 4; i++) {
      this.platformForm.patchValue({
        [`field${i}`]: '',
      });
    }

    this.contentJson = {
      header: header.type ? { type: header.type } : undefined
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
    const items = this.getSortableItems();
    this.contentJson = this.editService.updateContentOrder(items, this.contentJson);
    this.platformForm.get('content')?.setValue(JSON.stringify(this.contentJson), { emitEvent: false });
  }

  moveItemUp(index: number): void {
    if (index > 0) {
      const items = this.getSortableItems();
      [items[index - 1], items[index]] = [items[index], items[index - 1]];
      this.contentJson = this.editService.updateContentOrder(items, this.contentJson);
      this.platformForm.get('content')?.setValue(JSON.stringify(this.contentJson), { emitEvent: false });
    }
  }

  moveItemDown(index: number): void {
    const items = this.getSortableItems();
    if (index < items.length - 1) {
      [items[index], items[index + 1]] = [items[index + 1], items[index]];
      this.contentJson = this.editService.updateContentOrder(items, this.contentJson);
      this.platformForm.get('content')?.setValue(JSON.stringify(this.contentJson), { emitEvent: false });
    }
  }

  getComponentFields(componentType: string): string[] {
    if (!componentType) return [];
    const type = componentType.toLowerCase().replace(/[-\s]/g, '');
    return this.elementsfields[type] || [];
  }

  getSelectedComponents(): { type: string, fields: string[] }[] {
    const components = [];
    
    if (this.platformForm.get('field1')?.value) {
      components.push({
        type: this.platformForm.get('field1')?.value,
        fields: this.getComponentFields(this.platformForm.get('field1')?.value)
      });
    }

    for (let i = 2; i <= 4; i++) {
      const fieldValue = this.platformForm.get(`field${i}`)?.value;
      if (fieldValue) {
        components.push({
          type: fieldValue,
          fields: this.getComponentFields(fieldValue)
        });
      }
    }

    return components;
  }

  updateField(componentType: string, fieldName: string, value: string) {
    if (!this.contentJson[componentType]) {
      this.contentJson[componentType] = { type: componentType };
    }
    this.contentJson[componentType][fieldName] = value;
    this.platformForm.get('content')?.setValue(JSON.stringify(this.contentJson), { emitEvent: false });
  }

  getFieldValue(componentType: string, fieldName: string): string {
    return this.contentJson[componentType]?.[fieldName] || '';
  }
}