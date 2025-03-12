import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmingPracticeComponent } from './farming-practice.component';

describe('FarmingPracticeComponent', () => {
  let component: FarmingPracticeComponent;
  let fixture: ComponentFixture<FarmingPracticeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FarmingPracticeComponent]
    });
    fixture = TestBed.createComponent(FarmingPracticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
