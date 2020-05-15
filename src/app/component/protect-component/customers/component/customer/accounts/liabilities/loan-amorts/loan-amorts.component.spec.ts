import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanAmortsComponent } from './loan-amorts.component';

describe('LoanAmortsComponent', () => {
  let component: LoanAmortsComponent;
  let fixture: ComponentFixture<LoanAmortsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanAmortsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanAmortsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
