import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailListingComponent } from './email-listing.component';

describe('EmailListingComponent', () => {
  let component: EmailListingComponent;
  let fixture: ComponentFixture<EmailListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
