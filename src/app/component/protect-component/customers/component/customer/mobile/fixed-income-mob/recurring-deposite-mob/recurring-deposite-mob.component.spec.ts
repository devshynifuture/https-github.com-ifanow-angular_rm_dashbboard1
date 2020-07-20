import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringDepositeMobComponent } from './recurring-deposite-mob.component';

describe('RecurringDepositeMobComponent', () => {
  let component: RecurringDepositeMobComponent;
  let fixture: ComponentFixture<RecurringDepositeMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecurringDepositeMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecurringDepositeMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
