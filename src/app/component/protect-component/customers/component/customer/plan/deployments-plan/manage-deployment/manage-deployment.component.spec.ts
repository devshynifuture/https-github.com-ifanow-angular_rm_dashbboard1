import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDeploymentComponent } from './manage-deployment.component';

describe('ManageDeploymentComponent', () => {
  let component: ManageDeploymentComponent;
  let fixture: ComponentFixture<ManageDeploymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageDeploymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDeploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
