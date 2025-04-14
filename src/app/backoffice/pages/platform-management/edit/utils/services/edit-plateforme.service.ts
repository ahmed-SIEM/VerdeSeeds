import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class EditPlateformeService {
  constructor() { }

  initializeForm(fb: FormBuilder): FormGroup {
    return fb.group({
      nomPlateforme: ['', [Validators.required, Validators.minLength(3)]],
      couleur: ['#3A59D1', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      dateCreation: [new Date().toISOString().slice(0, 10).toString],
      valabilite: [ new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 10).toString() ],
      logo: ['', Validators.required],
      content: [''],
      field1: [''],
      field2: [''],
      field3: [''],
      field4: [''],
      field5: [''], 
      field6: ['']
    });
  }

  updateContentJson(formValue: any): any {
    
    // remove user from formValue before using it
    delete formValue["field1"]['user'];
    const contentJson: any = {
      header: { type: formValue.field1 || '' }
    };

    // Update to handle up to 5 components
    for (let i = 2; i <= 6; i++) {
      const fieldValue = formValue[`field${i}`];
      if (fieldValue) {
        delete formValue[`field${i}`][`user`];
        contentJson[`component${i - 1}`] = { type: fieldValue };
      }
    }

    return contentJson;
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getSelectionCount(formGroup: FormGroup): number {
    let count = 0;
    for (let i = 2; i <= 6; i++) {
      if (formGroup.get(`field${i}`)?.value) {
        count++;
      }
    }
    return count;
  }

  isSelectionLimitReached(formGroup: FormGroup): boolean {
    return this.getSelectionCount(formGroup) >= 5;
  }

  getSelectedItems(contentJson: any): { key: string, label: string, value: any }[] {
    return Object.keys(contentJson)
      .filter(key => key.startsWith('component') && contentJson[key]?.type)
      .map(key => ({
        key,
        label: `Component ${key.replace('component', '')}`,
        value: contentJson[key].type
      }));
  }

  getSortableItems(contentJson: any): { key: string, label: string, value: any }[] {
    return this.getSelectedItems(contentJson);
  }
}