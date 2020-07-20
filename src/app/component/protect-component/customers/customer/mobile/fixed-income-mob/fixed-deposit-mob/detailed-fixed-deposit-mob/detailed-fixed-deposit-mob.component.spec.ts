import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedFixedDepositMobComponent } from './detailed-fixed-deposit-mob.component';

describe('DetailedFixedDepositMobComponent', () => {
  let component: DetailedFixedDepositMobComponent;
  let fixture: ComponentFixture<DetailedFixedDepositMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedFixedDepositMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedFixedDepositMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
