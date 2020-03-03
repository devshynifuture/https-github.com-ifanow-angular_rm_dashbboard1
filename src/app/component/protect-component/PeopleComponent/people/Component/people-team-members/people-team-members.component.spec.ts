import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleTeamMembersComponent } from './people-team-members.component';

describe('PeopleTeamMembersComponent', () => {
  let component: PeopleTeamMembersComponent;
  let fixture: ComponentFixture<PeopleTeamMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeopleTeamMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleTeamMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
