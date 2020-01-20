import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashflowUpperInsuranceComponent } from './cashflow-upper-insurance.component';

describe('CashflowUpperInsuranceComponent', () => {
  let component: CashflowUpperInsuranceComponent;
  let fixture: ComponentFixture<CashflowUpperInsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashflowUpperInsuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashflowUpperInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
