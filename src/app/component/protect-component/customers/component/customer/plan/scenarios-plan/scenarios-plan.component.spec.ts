import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenariosPlanComponent } from './scenarios-plan.component';

describe('ScenariosPlanComponent', () => {
  let component: ScenariosPlanComponent;
  let fixture: ComponentFixture<ScenariosPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScenariosPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenariosPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
