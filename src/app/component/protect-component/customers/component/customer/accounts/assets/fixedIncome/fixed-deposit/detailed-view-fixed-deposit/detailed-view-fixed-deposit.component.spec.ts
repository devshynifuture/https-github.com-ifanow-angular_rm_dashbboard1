import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedViewFixedDepositComponent } from './detailed-view-fixed-deposit.component';

describe('DetailedViewFixedDepositComponent', () => {
  let component: DetailedViewFixedDepositComponent;
  let fixture: ComponentFixture<DetailedViewFixedDepositComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedViewFixedDepositComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedViewFixedDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
