import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashflowAddExpenseComponent } from './cashflow-add-expense.component';

describe('CashflowAddExpenseComponent', () => {
  let component: CashflowAddExpenseComponent;
  let fixture: ComponentFixture<CashflowAddExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashflowAddExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashflowAddExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
