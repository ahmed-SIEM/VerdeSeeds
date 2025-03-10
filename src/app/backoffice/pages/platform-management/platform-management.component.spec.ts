import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformManagementComponent } from './platform-management.component';

describe('PlatformManagementComponent', () => {
  let component: PlatformManagementComponent;
  let fixture: ComponentFixture<PlatformManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlatformManagementComponent]
    });
    fixture = TestBed.createComponent(PlatformManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
