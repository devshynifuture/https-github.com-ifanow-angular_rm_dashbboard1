import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePlanComponent } from './profile-plan.component';

describe('ProfilePlanComponent', () => {
  let component: ProfilePlanComponent;
  let fixture: ComponentFixture<ProfilePlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilePlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
