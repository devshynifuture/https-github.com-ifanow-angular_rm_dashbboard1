import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KycTransactionsComponent } from './kyc-transactions.component';

describe('KycTransactionsComponent', () => {
  let component: KycTransactionsComponent;
  let fixture: ComponentFixture<KycTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KycTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KycTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
