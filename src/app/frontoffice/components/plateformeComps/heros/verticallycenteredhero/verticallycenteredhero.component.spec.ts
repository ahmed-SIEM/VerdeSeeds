import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticallycenteredheroComponent } from './verticallycenteredhero.component';

describe('VerticallycenteredheroComponent', () => {
  let component: VerticallycenteredheroComponent;
  let fixture: ComponentFixture<VerticallycenteredheroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerticallycenteredheroComponent]
    });
    fixture = TestBed.createComponent(VerticallycenteredheroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
