import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';
import { PlateformeService } from 'src/app/services/plateforme/plateforme.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { TypePack } from './utils/interfaces/edit-plateforme.interface';
import { EditPlateformeService } from './utils/services/edit-plateforme.service';
import { componentServcie } from 'src/app/services/plateforme/component.service';

interface ComponentContent {
  type: string;
  [key: string]: any;
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
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgFor]
})
export class EditPlateformeComponent implements OnInit {
  readonly MIN_SELECTIONS = 3;


  userid = 1;



  currentStep = 1;
  currentModal: string | null = null;
  isEditMode = false;
  isLoading = false;
  platformId: number | null = null;

  platformForm: FormGroup;
  users: any[] = [];



  components: any[] = [];
  
  headerComponent : any[] = [];

  otherComponent : any[] = [];


  headerelements = [
    "headerwithicons",
    "centeredhero",
    "herowithimage",
    "verticallycenteredhero",
  ]

  typePackOptions = Object.values(TypePack);
  contentJson: ContentJson = { header: { type: '' } };
  selectedPlateforme: any = null;
  hoveredComponent: ComponentOption | null = null;
  headerComponents: ComponentOption[] = [
    { name: 'Header with Icons', value: 'headerwithicons', preview: '../../../../../assets/backoffice/img/preview-images/CustomHeaderWithIcons.png' },
    { name: 'Centered Hero', value: 'centeredhero', preview: '../../../../../assets/backoffice/img/preview-images/HeadingWithImageTitle.png' },
    { name: 'Hero with Image', value: 'herowithimage', preview: '../../../../../assets/backoffice/img/preview-images/HeadingRightWithImageTitle.png' },
    { name: 'Vertically Centered Hero', value: 'verticallycenteredhero', preview: '../../../../../assets/backoffice/img/preview-images/VerticallyCenteredHeroSignUpForm.png' }
  ];

  constructor(
    private fb: FormBuilder,
    private platformService: PlateformeService,
    private componentService: componentServcie,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private editService: EditPlateformeService
  ) {
    this.platformForm = this.editService.initializeForm(this.fb);
    this.setupFormListeners();
    this.loadConstantUser();
  }

  private loadConstantUser(): void {
    this.commonService.getUserById(this.userid).subscribe({
      next: (user) => {
        this.users = [user];
        this.loadComponents(user.idUser);

        console.log('User loaded:', user);
        console.log('Components loaded:', this.components);







      },
      error: (error) => console.error('Error loading constant user:', error)
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.platformId = +id;
      this.loadPlatform(this.platformId);
    } else {
      this.setDefaultDates();
    }
  }

  private setupFormListeners(): void {
    this.platformForm.valueChanges.subscribe(() => {
      this.contentJson = this.editService.updateContentJson(this.platformForm.value);
      this.platformForm.get('content')?.setValue(JSON.stringify(this.contentJson), { emitEvent: false });
    });
  }

  private setDefaultDates(): void {
    const today = new Date();
    const validityDate = new Date(today);
    validityDate.setMonth(today.getMonth() + 12);

    this.platformForm.patchValue({
      dateCreation: today.toISOString().split('T')[0],
      valabilite: validityDate.toISOString().split('T')[0]
    });
  }

  // User and Component Methods
  loadComponents(userId: number): void {
    if (!userId) return;

    this.componentService.getAllcomponentsbyuserid(userId).subscribe({
      next: (components) => {
        this.headerComponent = components.filter((component) => this.headerelements.includes(component.type));
        this.otherComponent = components.filter((component) => !this.headerelements.includes(component.type));
        console.log('Header components:', this.headerComponent);
        console.log('Other components:', this.otherComponent);
      },
      error: (error) => console.error('Error loading components:', error)
    });
  }

  onUserSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const userId = Number(select.value);
    if (userId) this.loadComponents(userId);
  }

  // Platform CRUD Methods
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
      this.platformForm.patchValue({
        field1: parsed.header?.type || '',
        field2: parsed.component1?.type || '',
        field3: parsed.component2?.type || '',
        field4: parsed.component3?.type || ''
      });
    } catch (error) {
      console.error('Error parsing content:', error);
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

  private prepareAndSubmitData(): void {
    const formData = { ...this.platformForm.value };
    const user = this.users[0];
    this.submitPlatformData(formData, user);
  }

  private submitPlatformData(formData: any, user: any): void {
    formData.agriculteur = user;
    if (this.isEditMode) formData.idPlateforme = this.platformId;

    const operation = this.isEditMode
      ? this.platformService.updatePlateforme(formData)
      : this.platformService.createPlateforme(formData);

    operation.subscribe({
      next: () => this.router.navigate(['/backoffice/platform']),
      error: (error) => console.error('Error saving platform:', error)
    });
  }

  // Navigation and UI Methods
  goToStep(step: number): void {
    if (step === 1) {
      this.currentStep = step;
    } else if (step === 2 && this.validateStep1()) {
      this.currentStep = step;
    } else if (step === 3 && this.validateStep2()) {
      this.currentStep = step;
    }
  }

  private validateStep1(): boolean {
    const step1Fields = ['nomPlateforme', 'typePack', 'couleur', 'description',
      'dateCreation', 'valabilite', 'logo', 'updateTheme'];
    return step1Fields.every(field => {
      const control = this.platformForm.get(field);
      control?.markAsTouched();
      return control?.valid;
    });
  }

  private validateStep2(): boolean {
    const field1 = this.platformForm.get('field1');

    if (!field1) {
      return false;
    }

    return field1.valid && this.getSelectionCount() >= this.MIN_SELECTIONS;
  }

  // Component Selection Methods
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

  // Helper Methods
  getSelectionCount(): number {
    return this.editService.getSelectionCount(this.platformForm);
  }

  isSelectionLimitReached(): boolean {
    return this.editService.isSelectionLimitReached(this.platformForm);
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

  onCancel(): void {
    this.router.navigate(['/backoffice/platform']);
  }

  onComponentHover(component: ComponentOption | null): void {
    this.hoveredComponent = component;
  }

  getComponentPreview(type: string): string {
    return this.headerComponents.find(c => c.value === type)?.preview || '';
  }
}