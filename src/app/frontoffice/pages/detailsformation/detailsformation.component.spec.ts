import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsformationComponent } from './detailsformation.component';

describe('DetailsformationComponent', () => {
  let component: DetailsformationComponent;
  let fixture: ComponentFixture<DetailsformationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsformationComponent]
    });
    fixture = TestBed.createComponent(DetailsformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
