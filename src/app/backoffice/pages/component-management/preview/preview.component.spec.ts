import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewComponent } from './previewComp.component';

describe('PreviewComponent', () => {
  let component: PreviewComponent;
  let fixture: ComponentFixture<PreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreviewComponent]
    });
    fixture = TestBed.createComponent(PreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
