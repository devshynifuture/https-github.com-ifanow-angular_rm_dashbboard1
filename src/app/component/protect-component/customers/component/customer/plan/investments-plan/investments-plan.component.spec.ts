import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentsPlanComponent } from './investments-plan.component';

describe('InvestmentsPlanComponent', () => {
  let component: InvestmentsPlanComponent;
  let fixture: ComponentFixture<InvestmentsPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestmentsPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentsPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
