import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashflowAddLiabilitiesComponent } from './cashflow-add-liabilities.component';

describe('CashflowAddLiabilitiesComponent', () => {
  let component: CashflowAddLiabilitiesComponent;
  let fixture: ComponentFixture<CashflowAddLiabilitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashflowAddLiabilitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashflowAddLiabilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
