import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubBrokerTeamMemberComponent } from './sub-broker-team-member.component';

describe('SubBrokerTeamMemberComponent', () => {
  let component: SubBrokerTeamMemberComponent;
  let fixture: ComponentFixture<SubBrokerTeamMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubBrokerTeamMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubBrokerTeamMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
