import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockScripLevelTransactionComponent } from './stock-scrip-level-transaction.component';

describe('StockScripLevelTransactionComponent', () => {
  let component: StockScripLevelTransactionComponent;
  let fixture: ComponentFixture<StockScripLevelTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockScripLevelTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockScripLevelTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
