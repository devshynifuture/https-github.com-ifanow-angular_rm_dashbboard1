import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanGoalsComponent } from './plan-goals.component';

describe('PlanGoalsComponent', () => {
  let component: PlanGoalsComponent;
  let fixture: ComponentFixture<PlanGoalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanGoalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanGoalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
