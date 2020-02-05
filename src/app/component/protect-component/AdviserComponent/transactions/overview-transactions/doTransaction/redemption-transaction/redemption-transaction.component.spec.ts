import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedemptionTransactionComponent } from './redemption-transaction.component';

describe('RedemptionTransactionComponent', () => {
  let component: RedemptionTransactionComponent;
  let fixture: ComponentFixture<RedemptionTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedemptionTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedemptionTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
