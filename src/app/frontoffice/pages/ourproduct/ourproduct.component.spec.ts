import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurproductComponent } from './ourproduct.component';

describe('OurproductComponent', () => {
  let component: OurproductComponent;
  let fixture: ComponentFixture<OurproductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OurproductComponent]
    });
    fixture = TestBed.createComponent(OurproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
