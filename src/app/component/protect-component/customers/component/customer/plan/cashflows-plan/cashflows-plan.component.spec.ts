import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashflowsPlanComponent } from './cashflows-plan.component';

describe('CashflowsPlanComponent', () => {
  let component: CashflowsPlanComponent;
  let fixture: ComponentFixture<CashflowsPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashflowsPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashflowsPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
