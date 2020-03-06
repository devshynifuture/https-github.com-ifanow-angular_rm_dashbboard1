import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankDetailsIINComponent } from './bank-details-iin.component';

describe('BankDetailsIINComponent', () => {
  let component: BankDetailsIINComponent;
  let fixture: ComponentFixture<BankDetailsIINComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankDetailsIINComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankDetailsIINComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
