import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsLiabilitiesComponent } from './accounts-liabilities.component';

describe('AccountsLiabilitiesComponent', () => {
  let component: AccountsLiabilitiesComponent;
  let fixture: ComponentFixture<AccountsLiabilitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountsLiabilitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsLiabilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
