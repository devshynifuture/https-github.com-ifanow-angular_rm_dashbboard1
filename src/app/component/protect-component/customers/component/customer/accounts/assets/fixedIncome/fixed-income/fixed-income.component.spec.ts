import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedIncomeComponent } from './fixed-income.component';

describe('FixedIncomeComponent', () => {
  let component: FixedIncomeComponent;
  let fixture: ComponentFixture<FixedIncomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedIncomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
