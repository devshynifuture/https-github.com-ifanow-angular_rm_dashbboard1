import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProfilePlanComponent } from './add-profile-plan.component';

describe('AddProfilePlanComponent', () => {
  let component: AddProfilePlanComponent;
  let fixture: ComponentFixture<AddProfilePlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProfilePlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProfilePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
