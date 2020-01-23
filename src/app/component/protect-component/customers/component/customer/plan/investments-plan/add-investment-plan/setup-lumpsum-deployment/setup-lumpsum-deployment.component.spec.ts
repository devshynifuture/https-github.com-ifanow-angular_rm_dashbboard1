import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupLumpsumDeploymentComponent } from './setup-lumpsum-deployment.component';

describe('SetupLumpsumDeploymentComponent', () => {
  let component: SetupLumpsumDeploymentComponent;
  let fixture: ComponentFixture<SetupLumpsumDeploymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupLumpsumDeploymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupLumpsumDeploymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
