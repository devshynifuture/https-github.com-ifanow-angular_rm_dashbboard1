import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountAndBillingComponent } from './account-and-billing.component';

describe('AccountAndBillingComponent', () => {
  let component: AccountAndBillingComponent;
  let fixture: ComponentFixture<AccountAndBillingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountAndBillingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountAndBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
