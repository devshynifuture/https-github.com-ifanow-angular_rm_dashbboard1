import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryPlanComponent } from './summary-plan.component';

describe('SummaryPlanComponent', () => {
  let component: SummaryPlanComponent;
  let fixture: ComponentFixture<SummaryPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
