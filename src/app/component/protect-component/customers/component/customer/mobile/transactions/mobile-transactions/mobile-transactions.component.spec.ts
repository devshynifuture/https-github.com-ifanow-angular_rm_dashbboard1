import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileTransactionsComponent } from './mobile-transactions.component';

describe('MobileTransactionsComponent', () => {
  let component: MobileTransactionsComponent;
  let fixture: ComponentFixture<MobileTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
