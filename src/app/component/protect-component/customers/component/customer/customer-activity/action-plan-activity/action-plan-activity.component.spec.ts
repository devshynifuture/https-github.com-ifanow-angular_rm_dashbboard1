import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPlanActivityComponent } from './action-plan-activity.component';

describe('ActionPlanActivityComponent', () => {
  let component: ActionPlanActivityComponent;
  let fixture: ComponentFixture<ActionPlanActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionPlanActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionPlanActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
