import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { componentServcie } from 'src/app/services/plateforme/component.service';

@Component({
  selector: 'app-componentedit-add',
  templateUrl: './edit-add.component.html',
  styleUrls: ['./edit-add.component.css']
})
export class EditAddComponent implements OnInit {
  componentForm: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private componentService: componentServcie,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.componentForm = this.fb.group({
      id: [null],
      type: ['', Validators.required],
      content: ['', Validators.required],
      plateforme: [null, Validators.required]
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
  }

  onSubmit(): void {
    if (this.componentForm.valid) {
      if (this.isEditMode) {
        this.componentService.updateComponent(this.componentForm.value).subscribe(() => {
          this.router.navigate(['/backoffice/component-management']);
        });
      } else {
        this.componentService.createComponent(this.componentForm.value).subscribe(() => {
          this.router.navigate(['/backoffice/component-management']);
        });
      }
    }
  }
}
