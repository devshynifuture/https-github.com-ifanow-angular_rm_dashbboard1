import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashflowPlanInsuranceComponent } from './cashflow-plan-insurance.component';

describe('CashflowPlanInsuranceComponent', () => {
  let component: CashflowPlanInsuranceComponent;
  let fixture: ComponentFixture<CashflowPlanInsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashflowPlanInsuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashflowPlanInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
