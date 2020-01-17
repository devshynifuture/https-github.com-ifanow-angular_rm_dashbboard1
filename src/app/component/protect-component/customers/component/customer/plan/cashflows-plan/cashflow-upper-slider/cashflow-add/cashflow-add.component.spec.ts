import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashflowAddComponent } from './cashflow-add.component';

describe('CashflowAddExpenseComponent', () => {
  let component: CashflowAddComponent;
  let fixture: ComponentFixture<CashflowAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CashflowAddComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashflowAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
