import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenteredscreenshotComponent } from './centeredscreenshot.component';

describe('CenteredscreenshotComponent', () => {
  let component: CenteredscreenshotComponent;
  let fixture: ComponentFixture<CenteredscreenshotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CenteredscreenshotComponent]
    });
    fixture = TestBed.createComponent(CenteredscreenshotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
