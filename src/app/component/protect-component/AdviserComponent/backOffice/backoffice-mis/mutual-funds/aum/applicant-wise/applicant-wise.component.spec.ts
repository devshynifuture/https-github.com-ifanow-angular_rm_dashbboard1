import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantWiseComponent } from './applicant-wise.component';

describe('ApplicantWiseComponent', () => {
  let component: ApplicantWiseComponent;
  let fixture: ComponentFixture<ApplicantWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicantWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
