import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiYearGoalComponent } from './multi-year-goal.component';

describe('MultiYearGoalComponent', () => {
  let component: MultiYearGoalComponent;
  let fixture: ComponentFixture<MultiYearGoalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiYearGoalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiYearGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
