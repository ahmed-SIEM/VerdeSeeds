import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsdetailsComponent } from './newsdetails.component';

describe('NewsdetailsComponent', () => {
  let component: NewsdetailsComponent;
  let fixture: ComponentFixture<NewsdetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewsdetailsComponent]
    });
    fixture = TestBed.createComponent(NewsdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
