import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashflowPlanExpenseComponent } from './cashflow-plan-expense.component';

describe('CashflowPlanExpenseComponent', () => {
  let component: CashflowPlanExpenseComponent;
  let fixture: ComponentFixture<CashflowPlanExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashflowPlanExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashflowPlanExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
