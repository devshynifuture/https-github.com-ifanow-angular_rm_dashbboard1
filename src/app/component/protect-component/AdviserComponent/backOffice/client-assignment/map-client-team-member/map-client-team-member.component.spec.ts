import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapClientTeamMemberComponent } from './map-client-team-member.component';

describe('MapClientTeamMemberComponent', () => {
  let component: MapClientTeamMemberComponent;
  let fixture: ComponentFixture<MapClientTeamMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapClientTeamMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapClientTeamMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
