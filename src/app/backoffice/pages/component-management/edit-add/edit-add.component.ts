import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { componentServcie } from 'src/app/services/plateforme/component.service';
import { PlateformeService } from 'src/app/services/plateforme/plateforme.service';
interface ContentJson {
  [key: string]: any; 
}@Component({
  selector: 'app-componentedit-add',
  templateUrl: './edit-add.component.html',
  styleUrls: ['./edit-add.component.css']
})



export class EditAddComponent implements OnInit {
  componentForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  selectedComponent: any;
  contentJson: ContentJson = {}; 
  users: any[] = [];
  componentId: number | null = null;

   Allcomponents = [
    { name: 'Header with Icons', value: 'headerwithicons' },
    { name: 'Centered Hero', value: 'centeredhero' },
    { name: 'Hero with Image', value: 'herowithimage' },
    { name: 'Vertically Centered Hero', value: 'verticallycenteredhero' },
    { name: 'Columns with Icons', value: 'columnswithicons' },
    { name: 'Custom Cards', value: 'customcards' },
    { name: 'Headings', value: 'headings' },
    { name: 'Heading Left with Image', value: 'headingleftwithimage' },
    { name: 'Heading Right with Image', value: 'headingrightwithimage' },
    { name: 'Newsletter', value: 'newsletter' },
    { name: 'Plateforme About', value: 'plateformeabout' }
  ];
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

  constructor(
    private fb: FormBuilder,
    private componentService: componentServcie,
    private platformService: PlateformeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.componentForm = this.fb.group({
      type: ['', Validators.required],
      content: ['', Validators.required],
      user_id: [null, Validators.required]

    });
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

  onSubmit(): void {
    console.log('Form submitted:', this.componentForm.value);
  
    if (this.componentForm.valid) {
      const formValue = this.componentForm.value;
      
      const payload = {
        type: formValue.type,
        content: formValue.content,
        user: {
          idUser: formValue.user_id
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
