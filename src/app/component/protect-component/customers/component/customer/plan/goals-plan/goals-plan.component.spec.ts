import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalsPlanComponent } from './goals-plan.component';

describe('GoalsPlanComponent', () => {
  let component: GoalsPlanComponent;
  let fixture: ComponentFixture<GoalsPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoalsPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoalsPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
