import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeplateformeComponent } from './homeplateforme.component';

describe('HomeplateformeComponent', () => {
  let component: HomeplateformeComponent;
  let fixture: ComponentFixture<HomeplateformeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeplateformeComponent]
    });
    fixture = TestBed.createComponent(HomeplateformeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
