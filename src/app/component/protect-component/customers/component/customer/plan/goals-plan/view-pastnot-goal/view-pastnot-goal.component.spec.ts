import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPastnotGoalComponent } from './view-pastnot-goal.component';

describe('ViewPastnotGoalComponent', () => {
  let component: ViewPastnotGoalComponent;
  let fixture: ComponentFixture<ViewPastnotGoalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPastnotGoalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPastnotGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
