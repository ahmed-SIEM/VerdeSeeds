import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HungingiconsComponent } from './hungingicons.component';

describe('HungingiconsComponent', () => {
  let component: HungingiconsComponent;
  let fixture: ComponentFixture<HungingiconsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HungingiconsComponent]
    });
    fixture = TestBed.createComponent(HungingiconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
