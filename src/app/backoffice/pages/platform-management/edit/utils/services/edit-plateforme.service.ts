import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlatformContent } from '../interfaces/edit-plateforme.interface';
import { MAX_SELECTIONS } from '../constants/edit-plateforme.constants';

@Injectable({ providedIn: 'root' })
export class EditPlateformeService {
  
  constructor() {}

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
  }

  updateContentJson(formValues: any): PlatformContent {
    const contentJson: PlatformContent = {};

    if (formValues.field1) {
      contentJson.header = { type: formValues.field1, title: formValues.field1Title || '' };
    }

    if (formValues.field2) {
      contentJson.component1 = { type: formValues.field2, title: formValues.field2Title || '', order: 0 };
    }
    if (formValues.field3) {
      contentJson.component2 = { type: formValues.field3, title: formValues.field3Title || '', order: 1 };
    }
    if (formValues.field4) {
      contentJson.component3 = { type: formValues.field4, title: formValues.field4Title || '', order: 2 };
    }

    return contentJson;
  }

  getSelectionCount(form: FormGroup): number {
    let count = 0;
    for (let i = 2; i <= 4; i++) {
      if (form.get(`field${i}`)?.value) count++;
    }
    return count;
  }

  isSelectionLimitReached(form: FormGroup): boolean {
    return this.getSelectionCount(form) >= MAX_SELECTIONS;
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getSelectedItems(contentJson: PlatformContent): { key: string, label: string, value: any }[] {
    return Object.entries(contentJson)
      .map(([key, value]) => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1),
        value
      }));
  }

  getSortableItems(contentJson: PlatformContent): { key: string, label: string, value: any }[] {
    return Object.entries(contentJson)
      .filter(([key]) => key !== 'header')
      .sort((a, b) => ((a[1] as { order: number }).order ?? 0) - ((b[1] as { order: number }).order ?? 0))
      .map(([key, value]) => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1),
        value: (value as { type: string }).type
      }));
  }

  updateContentOrder(items: { key: string; label: string; value: any }[], currentContent: PlatformContent): PlatformContent {
    const newContentJson: PlatformContent = {
      header: currentContent.header 
    };

    items.forEach((item, index) => {
      if (item && item.key && item.value !== undefined) {
        newContentJson[item.key] = {
          type: currentContent[item.key].type,
          title: currentContent[item.key].title,
          order: index 
        };
      }
    });

    return newContentJson;
  }
}