import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsEmpanelledAmcComponent } from './settings-empanelled-amc.component';

describe('SettingsEmpanelledAmcComponent', () => {
  let component: SettingsEmpanelledAmcComponent;
  let fixture: ComponentFixture<SettingsEmpanelledAmcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsEmpanelledAmcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsEmpanelledAmcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
