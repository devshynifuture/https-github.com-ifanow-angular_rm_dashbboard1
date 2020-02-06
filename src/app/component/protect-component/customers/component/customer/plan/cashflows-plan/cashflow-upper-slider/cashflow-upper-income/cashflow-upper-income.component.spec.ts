import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashflowUpperIncomeComponent } from './cashflow-upper-income.component';

describe('CashflowUpperIncomeComponent', () => {
  let component: CashflowUpperIncomeComponent;
  let fixture: ComponentFixture<CashflowUpperIncomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashflowUpperIncomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashflowUpperIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
