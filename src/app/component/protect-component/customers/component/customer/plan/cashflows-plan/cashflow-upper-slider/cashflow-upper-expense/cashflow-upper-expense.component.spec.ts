import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashflowUpperExpenseComponent } from './cashflow-upper-expense.component';

describe('CashflowUpperExpenseComponent', () => {
  let component: CashflowUpperExpenseComponent;
  let fixture: ComponentFixture<CashflowUpperExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashflowUpperExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashflowUpperExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
