import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashflowUpperLiabilitiesComponent } from './cashflow-upper-liabilities.component';

describe('CashflowUpperLiabilitiesComponent', () => {
  let component: CashflowUpperLiabilitiesComponent;
  let fixture: ComponentFixture<CashflowUpperLiabilitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashflowUpperLiabilitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashflowUpperLiabilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
