import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsClientSettingsComponent } from './settings-client-settings.component';

describe('SettingsClientSettingsComponent', () => {
  let component: SettingsClientSettingsComponent;
  let fixture: ComponentFixture<SettingsClientSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsClientSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsClientSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
