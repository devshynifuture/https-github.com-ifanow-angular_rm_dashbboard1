import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashflowPlanIncomeComponent } from './cashflow-plan-income.component';

describe('CashflowPlanIncomeComponent', () => {
  let component: CashflowPlanIncomeComponent;
  let fixture: ComponentFixture<CashflowPlanIncomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashflowPlanIncomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashflowPlanIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
