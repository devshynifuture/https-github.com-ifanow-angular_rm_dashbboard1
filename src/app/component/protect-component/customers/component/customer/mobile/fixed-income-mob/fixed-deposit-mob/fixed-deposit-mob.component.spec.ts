import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedDepositMobComponent } from './fixed-deposit-mob.component';

describe('FixedDepositMobComponent', () => {
  let component: FixedDepositMobComponent;
  let fixture: ComponentFixture<FixedDepositMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedDepositMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedDepositMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
