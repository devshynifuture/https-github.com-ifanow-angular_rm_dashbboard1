import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetTeamMemberPasswordComponent } from './set-team-member-password.component';

describe('SetTeamMemberPasswordComponent', () => {
  let component: SetTeamMemberPasswordComponent;
  let fixture: ComponentFixture<SetTeamMemberPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetTeamMemberPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetTeamMemberPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
