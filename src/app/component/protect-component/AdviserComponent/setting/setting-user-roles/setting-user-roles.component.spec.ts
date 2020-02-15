import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingUserRolesComponent } from './setting-user-roles.component';

describe('SettingUserRolesComponent', () => {
  let component: SettingUserRolesComponent;
  let fixture: ComponentFixture<SettingUserRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingUserRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingUserRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
