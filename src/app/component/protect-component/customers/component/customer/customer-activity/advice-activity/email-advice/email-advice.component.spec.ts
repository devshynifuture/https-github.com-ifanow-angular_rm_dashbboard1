import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailAdviceComponent } from './email-advice.component';

describe('EmailAdviceComponent', () => {
  let component: EmailAdviceComponent;
  let fixture: ComponentFixture<EmailAdviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailAdviceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailAdviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
