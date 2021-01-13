import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherInsuranceInsurancePlanningComponent } from './other-insurance-insurance-planning.component';

describe('OtherInsuranceInsurancePlanningComponent', () => {
  let component: OtherInsuranceInsurancePlanningComponent;
  let fixture: ComponentFixture<OtherInsuranceInsurancePlanningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherInsuranceInsurancePlanningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherInsuranceInsurancePlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
