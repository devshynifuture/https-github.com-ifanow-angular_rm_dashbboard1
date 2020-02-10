import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailConsentComponent } from './email-consent.component';

describe('EmailConsentComponent', () => {
  let component: EmailConsentComponent;
  let fixture: ComponentFixture<EmailConsentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailConsentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
