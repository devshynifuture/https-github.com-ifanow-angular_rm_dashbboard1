import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentsPlanComponent } from './deployments-plan.component';

describe('DeploymentsPlanComponent', () => {
  let component: DeploymentsPlanComponent;
  let fixture: ComponentFixture<DeploymentsPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DeploymentsPlanComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeploymentsPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
