import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailDraftComponent } from './email-draft.component';

describe('EmailDraftComponent', () => {
  let component: EmailDraftComponent;
  let fixture: ComponentFixture<EmailDraftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailDraftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
