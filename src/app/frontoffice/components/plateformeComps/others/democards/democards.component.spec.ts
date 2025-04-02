import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemocardsComponent } from './democards.component';

describe('DemocardsComponent', () => {
  let component: DemocardsComponent;
  let fixture: ComponentFixture<DemocardsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DemocardsComponent]
    });
    fixture = TestBed.createComponent(DemocardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
