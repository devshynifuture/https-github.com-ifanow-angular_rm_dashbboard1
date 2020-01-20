import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashflowUpperIncomeExpenseComponent } from './cashflow-upper-income-expense.component';

describe('CashflowUpperIncomeExpenseComponent', () => {
  let component: CashflowUpperIncomeExpenseComponent;
  let fixture: ComponentFixture<CashflowUpperIncomeExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CashflowUpperIncomeExpenseComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashflowUpperIncomeExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
