import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { componentServcie } from 'src/app/services/plateforme/component.service';
import { PlateformeService } from 'src/app/services/plateforme/plateforme.service';
type ComponentType = 'headerwithicons' | 'centeredhero' | 'herowithimage' | 'verticallycenteredhero' |
  'columnswithicons' | 'customcards' | 'headings' | 'headingleftwithimage' |
  'headingrightwithimage' | 'newsletter' | 'plateformeabout';

interface ContentJson {
  [key: string]: any;
}

@Component({
  selector: 'app-componentedit-add',
  templateUrl: './edit-add.component.html',
  styleUrls: ['./edit-add.component.css']
})

export class EditAddComponent implements OnInit {
  componentForm: FormGroup;
  contentForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  selectedComponent: any;
  contentJson: ContentJson = {};
  users: any[] = [];
  componentId: number | null = null;
  currentStep = 1;
  showModal = false;
  selectedComponentType: ComponentType | null = null;
  componentFields: string[] = [];
  hoveredComponent: any = null;

  categorizedComponents = {
    headers: [
      { name: 'Header with Icons', value: 'headerwithicons', preview: '../../../../../assets/backoffice/img/preview-images/CustomHeaderWithIcons.png' },
      { name: 'Centered Hero', value: 'centeredhero', preview: '../../../../../assets/backoffice/img/preview-images/centered-hero.png' },
      { name: 'Hero with Image', value: 'herowithimage', preview: '../../../../../assets/backoffice/img/preview-images/hero-image.png' },
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

  constructor(
    private fb: FormBuilder,
    private componentService: componentServcie,
    private platformService: PlateformeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.componentForm = this.fb.group({
      user_id: [null, Validators.required]
    });
    this.contentForm = this.fb.group({});
  }

  loadusers() {
    this.platformService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }

  loadcomponent(id: number) {
    this.isLoading = true;
    this.componentService.getComponent(id).subscribe({
      next: (component) => {
        this.selectedComponent = component;
        this.componentForm.patchValue({
          ...component,
        });
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
      this.componentService.getComponent(+id).subscribe(data => {
        this.componentForm.patchValue(data);
      });
    }

    this.loadusers();
    if (id) {
      this.isEditMode = true;
      this.componentId = +id;
      this.loadcomponent(this.componentId);
    } else {
      this.componentForm.get('user_id')?.setValidators(Validators.required);
    }
    this.componentForm.get('user_id')?.updateValueAndValidity();
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
      group[field] = ['', Validators.required];
    });
    this.contentForm = this.fb.group(group);
  }

  getComponentDisplayName(value: ComponentType | null): string {
    for (const category of Object.values(this.categorizedComponents)) {
      const component = category.find(comp => comp.value === value);
      if (component) return component.name;
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

  onSubmit(): void {
    if (this.componentForm.valid && this.contentForm.valid && this.selectedComponentType) {
      const payload = {
        type: this.selectedComponentType,
        content: JSON.stringify(this.contentForm.value),
        user: {
          idUser: this.componentForm.get('user_id')?.value
        }
      };

      const request = this.isEditMode && this.componentId
        ? this.componentService.updateComponent(payload)
        : this.componentService.createComponent(payload);

      request.subscribe({
        next: () => this.router.navigate(['/backoffice/component']),
        error: err => console.error('Error:', err),
      });
    }
  }

  onCancel() {
    this.router.navigate(['/backoffice/platform']);
  }
}
