import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashflowAddIncomeComponent } from './cashflow-add-income.component';

describe('CashflowAddIncomeComponent', () => {
  let component: CashflowAddIncomeComponent;
  let fixture: ComponentFixture<CashflowAddIncomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashflowAddIncomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashflowAddIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
