import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleGoalYearComponent } from './single-goal-year.component';

describe('SingleGoalYearComponent', () => {
  let component: SingleGoalYearComponent;
  let fixture: ComponentFixture<SingleGoalYearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleGoalYearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleGoalYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
