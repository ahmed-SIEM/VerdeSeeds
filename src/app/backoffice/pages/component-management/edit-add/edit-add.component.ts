import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { componentServcie } from 'src/app/services/plateforme/component.service';
import { PlateformeService } from 'src/app/services/plateforme/plateforme.service';
import { CommonService } from 'src/app/services/common.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FirebaseUrlPipe } from 'src/app/pipes/firebase-url.pipe';

type ComponentType = 'headerwithicons' | 'centeredhero' | 'herowithimage' | 'verticallycenteredhero' |
  'columnswithicons' | 'customcards' | 'headings' | 'headingleftwithimage' |
  'headingrightwithimage' | 'newsletter' | 'plateformeabout';

interface ContentJson {
  [key: string]: any;
}

@Component({
  selector: 'app-componentedit-add',
  templateUrl: './edit-add.component.html',
  styleUrls: ['./edit-add.component.css'],
})

export class EditAddComponent implements OnInit {
  componentForm: FormGroup;
  contentForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  selectedComponent: any;
  contentJson: ContentJson = {};
  userid = 1;
  user: any[] = [];
  componentId: number | null = null;
  currentStep = 1;
  showModal = false;
  selectedComponentType: ComponentType | null = null;
  componentFields: string[] = [];
  hoveredComponent: any = null;

  private selectedImageFiles: { [key: string]: File } = {};
  private imagePreviews: { [key: string]: string } = {};
  private validFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  showIconModal = false;
  currentIconField = '';
  availableIcons = [
    'bi-balloon', 'bi-alarm', 'bi-archive',
    'bi-award', 'bi-bag', 'bi-bell',
    'bi-bookmark', 'bi-camera', 'bi-cart'
  ];

  categorizedComponents = {
    headers: [
      { name: 'Header with Icons', value: 'headerwithicons', preview: '../../../../../assets/backoffice/img/preview-images/CustomHeaderWithIcons.png' },
      { name: 'Centered Hero', value: 'centeredhero', preview: '../../../../../assets/backoffice/img/preview-images/HeadingWithImageTitle.png' },
      { name: 'Hero with Image', value: 'herowithimage', preview: '../../../../../assets/backoffice/img/preview-images/HeadingRightWithImageTitle.png' },
      { name: 'Vertically Centered Hero', value: 'verticallycenteredhero', preview: '../../../../../assets/backoffice/img/preview-images/VerticallyCenteredHeroSignUpForm.png' }
    ],
    features: [
      { name: 'Columns with Icons', value: 'columnswithicons', preview: '../../../../../assets/backoffice/img/preview-images/ColumnsWithIcons.png' },
      { name: 'Custom Cards', value: 'customcards', preview: '../../../../../assets/backoffice/img/preview-images/CustomCards.png' },
      { name: 'Headings', value: 'headings', preview: '../../../../../assets/backoffice/img/preview-images/Headings.png' },
      { name: 'Heading Left with Image', value: 'headingleftwithimage', preview: '../../../../../assets/backoffice/img/preview-images/LeftImage.png' },
      { name: 'Heading Right with Image', value: 'headingrightwithimage', preview: '../../../../../assets/backoffice/img/preview-images/RightImage.png' }
    ],
    others: [
      { name: 'Newsletter', value: 'newsletter', preview: '../../../../../assets/backoffice/img/preview-images/Newsletter.png' },
      { name: 'Plateforme About', value: 'plateformeabout', preview: '../../../../../assets/backoffice/img/preview-images/AboutUs.png' }
    ]
  };

  ELEMENTS_FIELDS: Record<ComponentType, string[]> = {
    headerwithicons: [
      "title", "subtitle", "Ftitle", "Ficon",
      "Stitle", "Sicon", "Ttitle", "Ticon",
      "Ptitle", "Picon"
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
      "MainTitle", "Ftitle", "Fdescription", "Ficon",
      "Stitle", "Sdescription", "Sicon",
      "Ttitle", "Tdescription", "Ticon"
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

  constructor(
    private fb: FormBuilder,
    private componentService: componentServcie,
    private platformService: PlateformeService,
    private commonservice: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private firebaseStorage: FirebaseStorageService
  ) {
    this.componentForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100),
        Validators.pattern('^[a-zA-Z0-9\\s]+$')
      ]]
    });
    
    this.contentForm = this.fb.group({});
  }

  loaduser() {
    this.commonservice.getUserById(this.userid).subscribe({
      next: (user) => {
        console.log('User loaded:', user);
        this.user = user;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  loadcomponent(id: number) {
    this.isLoading = true;
    this.componentService.getComponent(id).subscribe({
      next: (component) => {
        this.selectedComponent = component;
        this.selectedComponentType = component.type as ComponentType;
        this.componentFields = this.ELEMENTS_FIELDS[component.type as ComponentType];
        this.componentForm.patchValue({
          name: component.name
        });
        this.initializeContentForm();
        // Parse and set content form values if they exist
        if (component.content) {
          const contentData = JSON.parse(component.content);
          this.contentForm.patchValue(contentData);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading component:', error);
        this.isLoading = false;
      }
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.componentId = +id;
      this.loadcomponent(this.componentId);
    }
    this.loaduser();
  }

  openComponentModal() {
    this.showModal = true;
  }

  closeComponentModal() {
    this.showModal = false;
  }

  selectComponent(type: string) {
    this.selectedComponentType = type as ComponentType; // Ensure proper casting
    this.showModal = false;
    this.componentFields = this.ELEMENTS_FIELDS[type as ComponentType];
    this.initializeContentForm();
  }

  initializeContentForm() {
    const group: any = {};
    this.componentFields.forEach(field => {
      const isImageField = field.includes('image') || field.includes('imageUrl');
      const isIconField = field.toLowerCase().includes('icon');
      group[field] = ['', [
        Validators.required,
        isImageField ? this.imageValidator() : Validators.minLength(1)
      ]];
    });
    this.contentForm = this.fb.group(group);
  }

  imageValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (this.isEditMode && control.value && typeof control.value === 'string') {
        return null; // Allow existing image URLs in edit mode
      }
      if (!control.value) {
        return { required: true };
      }
      if (control.value instanceof File) {
        if (!this.validFileTypes.includes(control.value.type)) {
          return { invalidType: true };
        }
      }
      return null;
    };
  }

  getComponentDisplayName(value: ComponentType | null): string {
    for (const category of Object.values(this.categorizedComponents)) {
      const component = category.find(comp => comp.value === value);
      if (component) return component.name;
    }
    return '';
  }

  getErrorMessage(control: string, form: 'component' | 'content'): string {
    const formControl = form === 'component' ? 
      this.componentForm.get(control) : 
      this.contentForm.get(control);

    if (!formControl) return '';

    if (formControl.hasError('required')) {
      return `${control} is required`;
    }

    if (formControl.hasError('minlength')) {
      return `${control} must be at least ${formControl.errors?.['minlength'].requiredLength} characters`;
    }

    if (formControl.hasError('maxlength')) {
      return `${control} cannot exceed ${formControl.errors?.['maxlength'].requiredLength} characters`;
    }

    if (formControl.hasError('pattern')) {
      return `${control} can only contain letters, numbers, and spaces`;
    }

    if (formControl.hasError('invalidType')) {
      return `${control} must be a valid image file (JPEG, PNG, GIF, or WEBP)`;
    }

    return '';
  }

  nextStep() {
    if (this.currentStep === 1 && this.selectedComponentType && this.componentForm.valid) {
      this.currentStep = 2;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onComponentHover(component: any) {
    this.hoveredComponent = component;
  }

  onImageFileSelected(event: Event, fieldName: string): void {
    const input = event.target as HTMLInputElement;
    const field = this.contentForm.get(fieldName);
    
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      if (!this.validFileTypes.includes(file.type)) {
        input.value = '';
        delete this.imagePreviews[fieldName];
        delete this.selectedImageFiles[fieldName];
        field?.setErrors({ invalidType: true });
        return;
      }

      this.selectedImageFiles[fieldName] = file;
      field?.setValue(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviews[fieldName] = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      field?.setValue('');
      delete this.imagePreviews[fieldName];
      delete this.selectedImageFiles[fieldName];
    }
  }

  openIconModal(fieldName: string) {
    this.currentIconField = fieldName;
    this.showIconModal = true;
  }

  closeIconModal() {
    this.showIconModal = false;
  }

  selectIcon(icon: string) {
    this.contentForm.get(this.currentIconField)?.setValue(icon);
    this.closeIconModal();
  }

  private async uploadImages(): Promise<any> {
    const updates: any = {};
    const uploadPromises = [];

    for (const [fieldName, file] of Object.entries(this.selectedImageFiles)) {
      const uploadPromise = new Promise((resolve, reject) => {
        this.firebaseStorage.uploadFile(file).subscribe({
          next: (response) => {
            updates[fieldName] = response.fileName;
            resolve(response);
          },
          error: (error) => reject(error)
        });
      });
      uploadPromises.push(uploadPromise);
    }

    try {
      await Promise.all(uploadPromises);
      return updates;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.componentForm.valid && this.contentForm.valid && this.selectedComponentType) {
      try {
        // Upload any new images first
        const imageUpdates = await this.uploadImages();
        
        // Update the content form with the new image URLs
        const contentValue = { ...this.contentForm.value };
        Object.keys(imageUpdates).forEach(fieldName => {
          contentValue[fieldName] = imageUpdates[fieldName];
        });

        const payload: any = {
          type: this.selectedComponentType,
          content: JSON.stringify(contentValue),
          name: this.componentForm.get('name')?.value,
          user: this.user,
        };

        if (this.isEditMode && this.componentId) {
          payload.id = this.componentId;
        }

        const request = this.isEditMode && this.componentId
          ? this.componentService.updateComponent(payload)
          : this.componentService.createComponent(payload);

        request.subscribe({
          next: () => this.router.navigate(['/backoffice/component']),
          error: err => console.error('Error:', err),
        });
      } catch (error) {
        console.error('Error during submission:', error);
      }
    }
  }

  private async deleteImage(fieldName: string): Promise<void> {
    const currentValue = this.contentForm.get(fieldName)?.value;
    if (currentValue) {
      try {
        await this.firebaseStorage.deleteFile(currentValue).toPromise();
        this.contentForm.get(fieldName)?.setValue('');
      } catch (error) {
        console.error(`Error deleting image for ${fieldName}:`, error);
      }
    }
  }

  onCancel() {
    this.router.navigate(['/backoffice/component']);
  }
}
