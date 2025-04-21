import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { PlateformeService } from 'src/app/services/plateforme/plateforme.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { EditPlateformeService } from './utils/services/edit-plateforme.service';
import { componentServcie } from 'src/app/services/plateforme/component.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { SharedModule } from 'src/app/shared/shared.module';

export enum TypePack {
  GUEST = 'GUEST',
  BASIC = 'BASIC',
  ADVANCED = 'ADVANCED',
  PREMIUM = 'PREMIUM'
}

interface ComponentContent {
  type: objectUnderCOmponentContent;
  [key: string]: any;
}

interface objectUnderCOmponentContent {
  id: number;
  type: string;
  name: string;
  content: string;
}

interface ContentJson {
  header: ComponentContent;
  [key: string]: ComponentContent;
}

interface ComponentOption {
  name: string;
  value: string;
  preview: string;
}

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgFor, SharedModule]
})
export class EditPlateformeComponent implements OnInit {
  color: string = '#FEBA17';
  readonly MIN_SELECTIONS = 3;
  readonly MAX_BASIC_SELECTIONS = 3;
  readonly MAX_PREMIUM_SELECTIONS = 5;
  readonly BASIC_COLORS = ['#102E50', '#328E6E', '#F7374F', '#FFF085'];
  isColorPickerEnabled = false;
  maxSelections = this.MAX_BASIC_SELECTIONS;

  userid = 1;
  selectPacktype = "";

  currentStep = 1;
  currentModal: string | null = null;
  isEditMode = false;
  isLoading = false;
  platformId: number | null = null;

  platformForm: FormGroup;
  users: any[] = [];

  components: any[] = [];

  headerComponent: any[] = [];

  otherComponent: any[] = [];

  headerelements = [
    "headerwithicons",
    "centeredhero",
    "herowithimage",
    "verticallycenteredhero",
  ]

  contentJson: ContentJson = {
    header: {
      type: {
        id: 0,
        type: '',
        name: '',
        content: '',
      }
    },
    component1: {
      type: {
        id: 0, type: '', name: '', content: ''
      }
    },
    component2: {
      type: {
        id: 0, type: '', name: '', content: ''
      }
    },
    component3: {
      type: {
        id: 0, type: '', name: '', content: ''
      }
    }, component4: {
      type: {
        id: 0, type: '', name: '', content: ''
      }
    }
  };
  selectedPlateforme: any = null;
  hoveredComponent: ComponentOption | null = null;
  headerComponents: ComponentOption[] = [
    { name: 'Header with Icons', value: 'headerwithicons', preview: '../../../../../assets/backoffice/img/preview-images/CustomHeaderWithIcons.png' },
    { name: 'Centered Hero', value: 'centeredhero', preview: '../../../../../assets/backoffice/img/preview-images/HeadingWithImageTitle.png' },
    { name: 'Hero with Image', value: 'herowithimage', preview: '../../../../../assets/backoffice/img/preview-images/HeadingRightWithImageTitle.png' },
    { name: 'Vertically Centered Hero', value: 'verticallycenteredhero', preview: '../../../../../assets/backoffice/img/preview-images/VerticallyCenteredHeroSignUpForm.png' }
  ];

  private selectedLogoFile: File | null = null;




  constructor(
    private fb: FormBuilder,
    private platformService: PlateformeService,
    private componentService: componentServcie,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private editService: EditPlateformeService,
    private firebaseStorage: FirebaseStorageService
  ) {
    this.platformForm = fb.group({
      nomPlateforme: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-Z][a-zA-Z0-9 ]*$/)
      ]],
      couleur: ['#3A59D1', Validators.required],
      description: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-Z][a-zA-Z0-9 ]*$/)
      ]],
      dateCreation: [new Date().toISOString().slice(0, 10), Validators.required],
      valabilite: [new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 10), Validators.required],
      logo: ['', Validators.required],
      content: [''],
      field1: [''],
      field2: [''],
      field3: [''],
      field4: [''],
      field5: [''],
      field6: [''],
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.platformForm.get(controlName);
    if (!control) return '';
    
    if (control.hasError('required')) {
      return `${controlName} cannot be blank`;
    }
    
    if (control.hasError('minlength')) {
      return `${controlName} must be at least 5 characters`;
    }
    
    if (control.hasError('maxlength')) {
      return `${controlName} cannot exceed 100 characters`;
    }
    
    if (control.hasError('pattern')) {
      return `${controlName} must start with a letter and can only contain letters, numbers, and spaces`;
    }
    
    return '';
  }

  private loadConstantUser(): void {
    this.commonService.getUserById(this.userid).subscribe({
      next: (user) => {
        this.users = [user];
        this.selectPacktype = user.typePack;
        console.log('Constant user loaded:', this.selectPacktype);

        if (this.selectPacktype === TypePack.GUEST) {
          alert('Guest users cannot create platforms');
          this.router.navigate(['/backoffice/platform']);
          return;
        }

        this.isColorPickerEnabled =
          this.selectPacktype === TypePack.PREMIUM ||
          this.selectPacktype === TypePack.ADVANCED;

        this.maxSelections =
          (this.selectPacktype === TypePack.PREMIUM || this.selectPacktype === TypePack.ADVANCED)
            ? this.MAX_PREMIUM_SELECTIONS
            : this.MAX_BASIC_SELECTIONS;

        if (this.selectPacktype === TypePack.BASIC) {
          this.platformForm.patchValue({
            couleur: this.BASIC_COLORS[0]
          });
        }

        const today = new Date();
        const nextYear = new Date(today);
        nextYear.setFullYear(today.getFullYear() + 1);

        this.platformForm.patchValue({
          dateCreation: today.toISOString().split('T')[0],
          valabilite: nextYear.toISOString().split('T')[0],
        });

        this.loadComponents(user.idUser);
      },
      error: (error) => console.error('Error loading constant user:', error)
    });
  }

  ngOnInit(): void {
    this.loadConstantUser();
    this.initializeForm();
  }

  private initializeForm(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.platformId = +id;
      this.loadPlatform(this.platformId);
    }
  }

  private setupFormListeners(): void {
    this.platformForm.valueChanges.subscribe((value) => {
      this.contentJson = this.editService.updateContentJson(this.platformForm.value);
      this.platformForm.get('content')?.setValue(JSON.stringify(this.contentJson), { emitEvent: false });
    });

    ['field1', 'field2', 'field3', 'field4'].forEach(field => {
      this.platformForm.get(field)?.valueChanges.subscribe(value => {
      });
    });
  }


  loadComponents(userId: number): void {
    if (!userId) return;

    this.componentService.getAllcomponentsbyuserid(userId).subscribe({
      next: (components) => {
        this.headerComponent = components.filter((component) =>
          this.headerelements.includes(component.type)
        );
        this.otherComponent = components.filter((component) =>
          !this.headerelements.includes(component.type)
        );

        if (this.isEditMode && this.selectedPlateforme?.content) {
          this.parsePlatformContent(this.selectedPlateforme.content);
        }
      },
      error: (error) => console.error('Error loading components:', error)
    });
  }

  onUserSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const userId = Number(select.value);
    if (userId) this.loadComponents(userId);
  }

  loadPlatform(id: number): void {
    this.isLoading = true;
    this.platformService.getPlateforme(id).subscribe({
      next: (platform) => this.handlePlatformLoadSuccess(platform),
      error: (error) => this.handlePlatformLoadError(error)
    });
  }

  private handlePlatformLoadSuccess(platform: any): void {
    this.selectedPlateforme = platform;
    this.patchFormValues(platform);
    this.parsePlatformContent(platform.content);
    this.isLoading = false;
  }

  private handlePlatformLoadError(error: any): void {
    console.error('Error loading platform:', error);
    this.isLoading = false;
  }

  private patchFormValues(platform: any): void {
    this.platformForm.patchValue({
      ...platform,
      dateCreation: platform.dateCreation.split('T')[0],
      valabilite: platform.valabilite.split('T')[0]
    });
  }

  private parsePlatformContent(content: string): void {
    if (!content) return;

    try {
      const parsed = JSON.parse(content);
      this.contentJson = parsed;

      const headerComponent = this.headerComponent.find(
        comp => comp.type === parsed?.header?.type?.type
      );

      this.platformForm.patchValue({
        field1: headerComponent || null,
        field2: parsed?.component1?.type || '',
        field3: parsed?.component2?.type || '',
        field4: parsed?.component3?.type || ''
      });
    } catch (error) {
      console.error('Error parsing content:', error);
    }
  }

  onLogoFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedLogoFile = input.files[0];
      
   
      
      // Create a temporary URL for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.platformForm.patchValue({
          logo: e.target?.result as string
        });
      };
      reader.readAsDataURL(this.selectedLogoFile);
    }


  }

  private prepareAndSubmitData(): void {
    if (this.selectedLogoFile) {
      // Upload the logo first, then submit form data
      this.firebaseStorage.uploadFile(this.selectedLogoFile).subscribe({
        next: (response) => {
          const formData = { ...this.platformForm.value };
          formData.logo = response.fileName;
          const user = this.users[0];
          this.submitPlatformData(formData, user);
        },
        error: (error) => {
          console.error('Error uploading logo:', error);
        }
      });
    } else {
      // If no new logo was selected, proceed with existing logo
      const formData = { ...this.platformForm.value };
      const user = this.users[0];
      this.submitPlatformData(formData, user);
    }
  }

  onSubmit(): void {
    if (this.platformForm.invalid || this.getSelectionCount() < this.MIN_SELECTIONS) {
      this.handleInvalidForm();
      return;
    }

    this.prepareAndSubmitData();
  }

  private handleInvalidForm(): void {
    this.editService.markFormGroupTouched(this.platformForm);
    console.warn('Form validation failed');
  }

  private submitPlatformData(formData: any, user: any): void {
    formData.agriculteur = user;
    if (this.isEditMode) {
      formData.agriculteur.plateforme_id = this.platformId;
      formData.idPlateforme = this.platformId;
    }

    delete formData.field1;
    delete formData.field2;
    delete formData.field3;
    delete formData.field4;

    if(this.selectPacktype === TypePack.BASIC) {
      formData.nomPlateforme = 'verdeseeds.' + formData.nomPlateforme;
    }



    console.log('Form data to submit:', formData);
    const operation = this.isEditMode
      ? this.platformService.updatePlateforme(formData)
      : this.platformService.createPlateforme(formData);

    operation.subscribe({
      next: () => this.router.navigate(['/backoffice/platform']),
      error: (error) => console.error('Error saving platform:', error)
    });
  }

  private validateStep1(): boolean {
    const requiredFields = ['nomPlateforme', 'couleur', 'description', 'logo'];
    let isValid = true;
    
    requiredFields.forEach(field => {
      const control = this.platformForm.get(field);
      if (control) {
        control.markAsTouched();
        if (control.invalid) {
          console.log(`Field ${field} is invalid:`, control.errors);
          isValid = false;
        }
      }
    });

    return isValid;
  }

  goToStep(step: number): void {
    if (step === 1) {
      this.currentStep = step;
    } else if (step === 2) {
      if (this.validateStep1()) {
        this.currentStep = step;
      } else {
        console.warn('Form validation failed for step 1');
      }
    } else if (step === 3) {
      if (this.validateStep2()) {
        this.currentStep = step;
      } else {
        console.warn('Failed to move to step 3 - validation failed');
      }
    }
  }

  private validateStep2(): boolean {
    const header = this.platformForm.get('field1')?.value;
    const selections = this.getSelectionCount();

    return !!header && selections >= this.MIN_SELECTIONS;
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

  clearSelections(): void {
    const header = { type: this.platformForm.get('field1')?.value || '' };

    [2, 3, 4].forEach(i => this.platformForm.get(`field${i}`)?.setValue(''));

    this.contentJson = { header };
    this.platformForm.get('content')?.setValue(JSON.stringify(this.contentJson));
  }

  getSelectionCount(): number {
    return this.editService.getSelectionCount(this.platformForm);
  }

  isSelectionLimitReached(): boolean {
    const selections = [
      this.platformForm.get('field2')?.value,
      this.platformForm.get('field3')?.value,
      this.platformForm.get('field4')?.value,
      this.platformForm.get('field5')?.value,
      this.platformForm.get('field6')?.value
    ].filter(value => value).length;

    return selections >= this.maxSelections;
  }

  getComponentSlots(): number[] {
    return Array.from({ length: this.maxSelections }, (_, i) => i + 1);
  }

  getSelectedItems(): { key: string, label: string, value: any }[] {
    return this.editService.getSelectedItems(this.contentJson);
  }

  getSortableItems(): { key: string, label: string, value: any }[] {
    return this.editService.getSortableItems(this.contentJson);
  }

  getSortedComponentKeys(): string[] {
    return Object.keys(this.contentJson)
      .filter(key => key.startsWith('component'))
      .sort((a, b) => parseInt(a.replace('component', ''), 10) - parseInt(b.replace('component', ''), 10));
  }

  moveItemUp(index: number): void {
    const keys = this.getSortedComponentKeys();
    if (index > 0) {
      [keys[index - 1], keys[index]] = [keys[index], keys[index - 1]];
      this.updateContentOrder(keys);
    }
  }

  moveItemDown(index: number): void {
    const keys = this.getSortedComponentKeys();
    if (index < keys.length - 1) {
      [keys[index], keys[index + 1]] = [keys[index + 1], keys[index]];
      this.updateContentOrder(keys);
    }
  }

  private updateContentOrder(keys: string[]): void {
    const newContent: ContentJson = { header: this.contentJson.header };

    keys.forEach((key, i) => {
      newContent[`component${i + 1}`] = { ...this.contentJson[key] };
    });

    this.contentJson = newContent;
    this.platformForm.get('content')?.setValue(JSON.stringify(this.contentJson), { emitEvent: false });
  }

  getComponentType(component: any): string {
    if (!component) return 'Not selected';
    if (typeof component === 'object') {
      if (component.type) {
        return component.type;
      }
      try {
        if (component.content) {
          const parsed = JSON.parse(component.content);
          console.log('Parsed component content:', parsed);
          return component.name || component.type || 'Unknown';
        }
      } catch (e) {
        console.error('Error parsing component content:', e);
      }
    }
    return 'Unknown';
  }

  onCancel(): void {
    this.router.navigate(['/backoffice/platform']);
  }

  canUseColorPicker(): boolean {
    return this.isColorPickerEnabled;
  }

  getAvailableColors(): string[] {
    return this.selectPacktype === TypePack.BASIC ? this.BASIC_COLORS : [];
  }

  onHeaderComponentSelect(option: any): void {
    this.platformForm.patchValue({
      field1: option
    });
    // Update content JSON when header changes
    this.contentJson.header = {
      type: option
    };
    this.platformForm.get('content')?.setValue(JSON.stringify(this.contentJson));
  }




  async generateColors(): Promise<void> {
    if (!this.selectedLogoFile) {
      console.warn('No file selected for upload');
      return;
    }

    const formData = new FormData();
    const file = this.selectedLogoFile as File;
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/analyze-colors", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Colors fetched:', result);

     
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }











}