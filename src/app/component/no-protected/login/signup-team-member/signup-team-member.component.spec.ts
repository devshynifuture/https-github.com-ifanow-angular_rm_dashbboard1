import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupTeamMemberComponent } from './signup-team-member.component';

describe('SignupTeamMemberComponent', () => {
  let component: SignupTeamMemberComponent;
  let fixture: ComponentFixture<SignupTeamMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupTeamMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupTeamMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
