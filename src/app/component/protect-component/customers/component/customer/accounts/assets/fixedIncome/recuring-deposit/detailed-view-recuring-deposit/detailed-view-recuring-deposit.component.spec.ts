import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedViewRecuringDepositComponent } from './detailed-view-recuring-deposit.component';

describe('DetailedViewRecuringDepositComponent', () => {
  let component: DetailedViewRecuringDepositComponent;
  let fixture: ComponentFixture<DetailedViewRecuringDepositComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedViewRecuringDepositComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedViewRecuringDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
