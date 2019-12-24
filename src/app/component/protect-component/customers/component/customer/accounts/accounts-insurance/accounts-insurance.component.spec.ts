import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsInsuranceComponent } from './accounts-insurance.component';

describe('AccountsInsuranceComponent', () => {
  let component: AccountsInsuranceComponent;
  let fixture: ComponentFixture<AccountsInsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountsInsuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
