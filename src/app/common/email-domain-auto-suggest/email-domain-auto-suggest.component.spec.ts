import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailDomainAutoSuggestComponent } from './email-domain-auto-suggest.component';

describe('EmailDomainAutoSuggestComponent', () => {
  let component: EmailDomainAutoSuggestComponent;
  let fixture: ComponentFixture<EmailDomainAutoSuggestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailDomainAutoSuggestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailDomainAutoSuggestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
