import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockTransactionDetailsComponent } from './stock-transaction-details.component';

describe('StockTransactionDetailsComponent', () => {
  let component: StockTransactionDetailsComponent;
  let fixture: ComponentFixture<StockTransactionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockTransactionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockTransactionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
