import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorFrontComponent } from './error-front.component';

describe('ErrorFrontComponent', () => {
  let component: ErrorFrontComponent;
  let fixture: ComponentFixture<ErrorFrontComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorFrontComponent]
    });
    fixture = TestBed.createComponent(ErrorFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
