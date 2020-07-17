import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashAndBankMobComponent } from './cash-and-bank-mob.component';

describe('CashAndBankMobComponent', () => {
  let component: CashAndBankMobComponent;
  let fixture: ComponentFixture<CashAndBankMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashAndBankMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashAndBankMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
