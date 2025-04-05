import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { PlateformeService } from 'src/app/services/plateforme/plateforme.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';

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




  elementsfields = {
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



 headerelements = [
  "headerwithicons",
  "centeredhero",
  "herowithimage",
  "verticallycenteredhero",
 ]

 featuredelements = [
  "columnswithicons",
  "customcards"]

  headingelements = [
    "headings",
    "headingleftwithimage",
    "headingrightwithimage"]

    otherselements = [
      "newsletter",
      "plateformeabout"
    ]


    components = [ this.featuredelements,this.headingelements, this.headerelements, this.otherselements ]



  currentStep: number = 1; // Track the current step
  currentModal: string | null = null;
  readonly MAX_SELECTIONS = 3; // Update max selections to 3
  readonly MINIMUM_SELECTIONS = 3; // Update minimum selections to 3

  TypePack = {
    BASIC: 'BASIC',
    PREMIUM: 'PREMIUM',
    ADVANCED: 'ADVANCED'
  }
  platformForm: FormGroup;
  isEditMode = false;
  platformId: number | null = null;
  typePackOptions = Object.values(this.TypePack);
  users: any[] = [];
  isLoading = false;
  selectedPlateforme: any = null;
  contentJson: any = {}; // Track the current content JSON dynamically
  activeAccordion: string | null = null;  // Track active accordion

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
      field1: [''],
      field2: [''],
      field3: [''],
      field4: [''],
      field5: [''],
      field6: [''],
      field1Title: ['', Validators.required],
      field2Title: ['', Validators.required],
      field3Title: ['', Validators.required],
      field4Title: ['', Validators.required],
      field5Title: ['', Validators.required],
      field6Title: ['', Validators.required]
    });

    // Update contentJson to include titles
    this.platformForm.valueChanges.subscribe(() => {
      const { field1, field2, field3, field4,
        field1Title, field2Title, field3Title, field4Title } = this.platformForm.value;
      this.contentJson = {};

      // Set header first (always order 0)
      if (field1) this.contentJson.header = { "type": field1, "title": field1Title };

      // Add other components with their order and title
      if (field2) this.contentJson.component1 = { "type": field2, "title": field2Title, "order": 0 };
      if (field3) this.contentJson.component2 = { "type": field3, "title": field3Title, "order": 1 };
      if (field4) this.contentJson.component3 = { "type": field4, "title": field4Title, "order": 2 };

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
    // Add validation for required header
    if (this.platformForm.get('field1')?.value &&
      this.platformForm.valid &&
      this.getSelectionCount() <= this.MAX_SELECTIONS) {
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
      // Validate that we have a header and minimum selections
      if (this.platformForm.get('field1')?.valid && this.getSelectionCount() >= this.MINIMUM_SELECTIONS) {
        this.currentStep = step;
      }
    } else if (step === 4) {
      // Only allow proceeding to step 4 if step 3 is valid
      const sortedItems = this.getSortableItems();
      if (sortedItems.length > 0) {
        this.currentStep = step;
      }
    }
  }

  getSelectionCount(): number {
    let count = 0;
    // Don't count header (field1) in the selection count
    if (this.platformForm.get('field2')?.value) count++;
    if (this.platformForm.get('field3')?.value) count++;
    if (this.platformForm.get('field4')?.value) count++;
    return count;
  }

  isSelectionLimitReached(): boolean {
    return this.getSelectionCount() >= this.MAX_SELECTIONS;
  }

  openModal(type: string): void {
    this.currentModal = type;
  }

  closeModal(): void {
    this.currentModal = null;
  }

  clearSelections() {
    // Preserve header selection (field1)
    const headerValue = this.platformForm.get('field1')?.value;
    const headerTitle = this.platformForm.get('field1Title')?.value;
    this.platformForm.patchValue({
      field2: '',
      field3: '',
      field4: '',
      field5: '',
      field6: '',
      field2Title: '',
      field3Title: '',
      field4Title: '',
      field5Title: '',
      field6Title: '',
      field1: headerValue, // Preserve header value
      field1Title: headerTitle // Preserve header title
    });

    // Update contentJson but keep header if selected
    this.contentJson = headerValue ? { header: { "type": headerValue, "title": headerTitle, "order": 0 } } : {};
    this.platformForm.get('content')?.setValue(JSON.stringify(this.contentJson));
  }

  getSelectedItems(): { key: string, label: string, value: any }[] {
    return Object.entries(this.contentJson).map(([key, value]) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      value
    }));
  }

  getSortableItems(): { key: string, label: string, value: any }[] {
    return Object.entries(this.contentJson)
      .filter(([key]) => key !== 'header')
      .sort((a, b) => ((a[1] as { order: number }).order ?? 0) - ((b[1] as { order: number }).order ?? 0)) // Sort by order, default to 0 if not set
      .map(([key, value]) => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1),
        value: (value as { type: string }).type
      }));
  }

  reorderItems(): void {
    const items = this.getSortableItems();
    this.updateContentJson(items);
  }

  moveItemUp(index: number): void {
    if (index > 0) {
      const items = this.getSortableItems();
      [items[index - 1], items[index]] = [items[index], items[index - 1]];
      this.updateContentJson(items);
    }
  }

  moveItemDown(index: number): void {
    const items = this.getSortableItems();
    if (index < items.length - 1) {
      [items[index], items[index + 1]] = [items[index + 1], items[index]];
      this.updateContentJson(items);
    }
  }

  updateContentJson(items: { key: string; label: string; value: any }[]): void {
    const newContentJson: any = {
      header: this.contentJson.header // Preserve the header
    };

    items.forEach((item, index) => {
      if (item && item.key && item.value !== undefined) {
        newContentJson[item.key] = {
          type: this.contentJson[item.key].type,
          title: this.contentJson[item.key].title,
          order: index // Order based on current position in the sorted list
        };
      }
    });

    this.contentJson = newContentJson;
    // Ensure content form field is updated with the new JSON
    this.platformForm.get('content')?.setValue(JSON.stringify(this.contentJson), { emitEvent: false });
  }

  toggleAccordion(key: string) {
    this.activeAccordion = this.activeAccordion === key ? null : key;
  }
}
