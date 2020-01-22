import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SipApplicantWiseComponent } from './sip-applicant-wise.component';

describe('SipApplicantWiseComponent', () => {
  let component: SipApplicantWiseComponent;
  let fixture: ComponentFixture<SipApplicantWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SipApplicantWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SipApplicantWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
