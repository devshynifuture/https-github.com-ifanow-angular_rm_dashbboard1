import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashflowPlanAssetsComponent } from './cashflow-plan-assets.component';

describe('CashflowPlanAssetsComponent', () => {
  let component: CashflowPlanAssetsComponent;
  let fixture: ComponentFixture<CashflowPlanAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashflowPlanAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashflowPlanAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
