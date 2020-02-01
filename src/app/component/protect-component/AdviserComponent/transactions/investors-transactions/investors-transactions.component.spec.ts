import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorsTransactionsComponent } from './investors-transactions.component';

describe('InvestorsTransactionsComponent', () => {
  let component: InvestorsTransactionsComponent;
  let fixture: ComponentFixture<InvestorsTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestorsTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestorsTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
