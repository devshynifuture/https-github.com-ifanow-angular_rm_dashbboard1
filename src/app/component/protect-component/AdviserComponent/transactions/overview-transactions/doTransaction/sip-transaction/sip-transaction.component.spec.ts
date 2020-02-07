import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SipTransactionComponent } from './sip-transaction.component';

describe('SipTransactionComponent', () => {
  let component: SipTransactionComponent;
  let fixture: ComponentFixture<SipTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SipTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SipTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
