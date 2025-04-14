import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadingrightwithimageComponent } from './headingrightwithimage.component';

describe('HeadingrightwithimageComponent', () => {
  let component: HeadingrightwithimageComponent;
  let fixture: ComponentFixture<HeadingrightwithimageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeadingrightwithimageComponent]
    });
    fixture = TestBed.createComponent(HeadingrightwithimageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
