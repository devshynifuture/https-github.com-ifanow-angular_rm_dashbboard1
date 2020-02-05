import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashflowPlanLiabilitiesComponent } from './cashflow-plan-liabilities.component';

describe('CashflowPlanLiabilitiesComponent', () => {
  let component: CashflowPlanLiabilitiesComponent;
  let fixture: ComponentFixture<CashflowPlanLiabilitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashflowPlanLiabilitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashflowPlanLiabilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
