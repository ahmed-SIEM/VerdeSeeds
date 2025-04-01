import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadingleftwithimageComponent } from './headingleftwithimage.component';

describe('HeadingleftwithimageComponent', () => {
  let component: HeadingleftwithimageComponent;
  let fixture: ComponentFixture<HeadingleftwithimageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeadingleftwithimageComponent]
    });
    fixture = TestBed.createComponent(HeadingleftwithimageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
