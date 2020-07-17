import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedRecurringDepositMobComponent } from './detailed-recurring-deposit-mob.component';

describe('DetailedRecurringDepositMobComponent', () => {
  let component: DetailedRecurringDepositMobComponent;
  let fixture: ComponentFixture<DetailedRecurringDepositMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedRecurringDepositMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedRecurringDepositMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
