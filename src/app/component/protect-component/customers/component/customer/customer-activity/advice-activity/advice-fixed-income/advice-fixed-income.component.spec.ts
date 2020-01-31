import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdviceFixedIncomeComponent } from './advice-fixed-income.component';

describe('AdviceFixedIncomeComponent', () => {
  let component: AdviceFixedIncomeComponent;
  let fixture: ComponentFixture<AdviceFixedIncomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdviceFixedIncomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdviceFixedIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
