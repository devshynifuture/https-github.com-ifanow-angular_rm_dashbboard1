import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SipCleanupTransactionComponent } from './sip-cleanup-transaction.component';

describe('SipCleanupTransactionComponent', () => {
  let component: SipCleanupTransactionComponent;
  let fixture: ComponentFixture<SipCleanupTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SipCleanupTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SipCleanupTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
