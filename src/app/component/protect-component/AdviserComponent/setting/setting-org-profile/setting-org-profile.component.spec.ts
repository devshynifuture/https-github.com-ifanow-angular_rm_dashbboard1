import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingOrgProfileComponent } from './setting-org-profile.component';

describe('SettingOrgProfileComponent', () => {
  let component: SettingOrgProfileComponent;
  let fixture: ComponentFixture<SettingOrgProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingOrgProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingOrgProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
