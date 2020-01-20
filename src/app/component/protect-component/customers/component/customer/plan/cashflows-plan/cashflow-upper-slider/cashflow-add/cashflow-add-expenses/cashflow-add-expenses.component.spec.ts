import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashflowAddExpensesComponent } from './cashflow-add-expenses.component';

describe('CashflowAddExpensesComponent', () => {
  let component: CashflowAddExpensesComponent;
  let fixture: ComponentFixture<CashflowAddExpensesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashflowAddExpensesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashflowAddExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
