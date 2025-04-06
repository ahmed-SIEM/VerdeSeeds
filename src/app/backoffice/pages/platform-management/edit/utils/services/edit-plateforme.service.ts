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
      typePack: ['', Validators.required],
      couleur: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      dateCreation: ['', Validators.required],
      valabilite: ['', Validators.required],
      logo: ['', Validators.required],
      updateTheme: ['', Validators.required],
      content: [''],
      field1: [''],
      field2: [''],
      field3: [''],
      field4: ['']
    });
  }

  updateContentJson(formValue: any): any {
    
    // remove user from formValue before using it
    delete formValue["field1"]['user'];
    const contentJson: any = {
      header: { type: formValue.field1 || '' }
    };

    for (let i = 2; i <= 4; i++) {
      const fieldValue = formValue[`field${i}`];
      delete formValue[`field${i}`][`user`]; 
      if (fieldValue) {
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
    for (let i = 2; i <= 4; i++) {
      if (formGroup.get(`field${i}`)?.value) {
        count++;
      }
    }
    return count;
  }

  isSelectionLimitReached(formGroup: FormGroup): boolean {
    return this.getSelectionCount(formGroup) >= 3;
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