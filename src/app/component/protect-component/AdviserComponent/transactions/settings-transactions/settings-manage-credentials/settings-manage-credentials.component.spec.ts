import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsManageCredentialsComponent } from './settings-manage-credentials.component';

describe('SettingsManageCredentialsComponent', () => {
  let component: SettingsManageCredentialsComponent;
  let fixture: ComponentFixture<SettingsManageCredentialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsManageCredentialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsManageCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
