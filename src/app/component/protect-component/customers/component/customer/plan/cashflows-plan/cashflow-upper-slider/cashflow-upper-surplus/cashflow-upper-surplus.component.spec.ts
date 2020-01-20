import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashflowUpperSurplusComponent } from './cashflow-upper-surplus.component';

describe('CashflowUpperSurplusComponent', () => {
  let component: CashflowUpperSurplusComponent;
  let fixture: ComponentFixture<CashflowUpperSurplusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashflowUpperSurplusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashflowUpperSurplusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
