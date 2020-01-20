import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashflowAddSurplusComponent } from './cashflow-add-surplus.component';

describe('CashflowAddSurplusComponent', () => {
  let component: CashflowAddSurplusComponent;
  let fixture: ComponentFixture<CashflowAddSurplusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashflowAddSurplusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashflowAddSurplusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
