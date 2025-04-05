import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { PlateformeService } from 'src/app/services/plateforme/plateforme.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { ELEMENTS_FIELDS, COMPONENTS, MAX_SELECTIONS, MINIMUM_SELECTIONS } from './utils/constants/edit-plateforme.constants';
import { PlatformContent, TypePack } from './utils/interfaces/edit-plateforme.interface';
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
  elementsfields = ELEMENTS_FIELDS;
  components = COMPONENTS;
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
  contentJson: PlatformContent = {}; 
  activeAccordion: string | null = null; 

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
              field1Title: parsedContent.header?.title || '',
              field2Title: parsedContent.component1?.title || '',
              field3Title: parsedContent.component2?.title || '',
              field4Title: parsedContent.component3?.title || ''
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
    } else if (step === 3) {
      if (this.platformForm.get('field1')?.valid && this.getSelectionCount() >= this.MINIMUM_SELECTIONS) {
        this.currentStep = step;
      }
    } else if (step === 4) {
      const sortedItems = this.getSortableItems();
      if (sortedItems.length > 0) {
        this.currentStep = step;
      }
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
      title: this.platformForm.get('field1Title')?.value
    };

    for (let i = 2; i <= 4; i++) {
      this.platformForm.patchValue({
        [`field${i}`]: '',
        [`field${i}Title`]: ''
      });
    }

    this.contentJson = {
      header: header.type ? { type: header.type, title: header.title || '' } : undefined
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

  toggleAccordion(key: string) {
    this.activeAccordion = this.activeAccordion === key ? null : key;
  }
}