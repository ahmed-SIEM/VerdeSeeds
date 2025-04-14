import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenteredheroComponent } from './centeredhero.component';

describe('CenteredheroComponent', () => {
  let component: CenteredheroComponent;
  let fixture: ComponentFixture<CenteredheroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CenteredheroComponent]
    });
    fixture = TestBed.createComponent(CenteredheroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
