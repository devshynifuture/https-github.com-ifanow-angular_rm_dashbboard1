import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashflowPlanSurplusComponent } from './cashflow-plan-surplus.component';

describe('CashflowPlanSurplusComponent', () => {
  let component: CashflowPlanSurplusComponent;
  let fixture: ComponentFixture<CashflowPlanSurplusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashflowPlanSurplusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashflowPlanSurplusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
