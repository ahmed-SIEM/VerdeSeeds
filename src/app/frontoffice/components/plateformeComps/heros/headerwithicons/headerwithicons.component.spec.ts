import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderwithiconsComponent } from './headerwithicons.component';

describe('HeaderwithiconsComponent', () => {
  let component: HeaderwithiconsComponent;
  let fixture: ComponentFixture<HeaderwithiconsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderwithiconsComponent]
    });
    fixture = TestBed.createComponent(HeaderwithiconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
