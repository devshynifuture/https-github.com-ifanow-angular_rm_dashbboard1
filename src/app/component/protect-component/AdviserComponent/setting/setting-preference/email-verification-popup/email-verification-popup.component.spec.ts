import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailVerificationPopupComponent } from './email-verification-popup.component';

describe('EmailVerificationPopupComponent', () => {
  let component: EmailVerificationPopupComponent;
  let fixture: ComponentFixture<EmailVerificationPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailVerificationPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailVerificationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
