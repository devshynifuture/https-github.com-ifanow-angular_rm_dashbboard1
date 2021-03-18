import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMemberClientListComponent } from './team-member-client-list.component';

describe('TeamMemberClientListComponent', () => {
  let component: TeamMemberClientListComponent;
  let fixture: ComponentFixture<TeamMemberClientListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamMemberClientListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamMemberClientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
