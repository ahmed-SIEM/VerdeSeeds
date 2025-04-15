import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnswithiconsComponent } from './columnswithicons.component';

describe('ColumnswithiconsComponent', () => {
  let component: ColumnswithiconsComponent;
  let fixture: ComponentFixture<ColumnswithiconsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ColumnswithiconsComponent]
    });
    fixture = TestBed.createComponent(ColumnswithiconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
