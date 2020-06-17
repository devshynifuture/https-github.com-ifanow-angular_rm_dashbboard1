import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkAllTransactionsComponent } from './bulk-all-transactions.component';

describe('BulkAllTransactionsComponent', () => {
  let component: BulkAllTransactionsComponent;
  let fixture: ComponentFixture<BulkAllTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkAllTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkAllTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
