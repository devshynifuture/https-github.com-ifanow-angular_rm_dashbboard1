import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailFaqAndSecurityComponent } from './email-faq-and-security.component';

describe('EmailFaqAndSecurityComponent', () => {
  let component: EmailFaqAndSecurityComponent;
  let fixture: ComponentFixture<EmailFaqAndSecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmailFaqAndSecurityComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailFaqAndSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
