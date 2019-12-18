import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MutualFundAllTransactionComponent } from './mutual-fund-all-transaction.component';

describe('MutualFundAllTransactionComponent', () => {
  let component: MutualFundAllTransactionComponent;
  let fixture: ComponentFixture<MutualFundAllTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MutualFundAllTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MutualFundAllTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
