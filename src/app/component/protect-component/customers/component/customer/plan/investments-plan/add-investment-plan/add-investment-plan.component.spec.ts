import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInvestmentPlanComponent } from './add-investment-plan.component';

describe('AddInvestmentPlanComponent', () => {
  let component: AddInvestmentPlanComponent;
  let fixture: ComponentFixture<AddInvestmentPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInvestmentPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInvestmentPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
