import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillsPaymentsComponent } from './bills-payments.component';

describe('BillsPaymentsComponent', () => {
  let component: BillsPaymentsComponent;
  let fixture: ComponentFixture<BillsPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillsPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillsPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
