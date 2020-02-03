import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAdviceFixedDepositComponent } from './all-advice-fixed-deposit.component';

describe('AllAdviceFixedDepositComponent', () => {
  let component: AllAdviceFixedDepositComponent;
  let fixture: ComponentFixture<AllAdviceFixedDepositComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllAdviceFixedDepositComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllAdviceFixedDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
