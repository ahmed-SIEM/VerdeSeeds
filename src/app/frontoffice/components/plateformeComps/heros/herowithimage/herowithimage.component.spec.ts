import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HerowithimageComponent } from './herowithimage.component';

describe('HerowithimageComponent', () => {
  let component: HerowithimageComponent;
  let fixture: ComponentFixture<HerowithimageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HerowithimageComponent]
    });
    fixture = TestBed.createComponent(HerowithimageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
