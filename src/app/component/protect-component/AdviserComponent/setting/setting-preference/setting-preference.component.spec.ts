import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingPreferenceComponent } from './setting-preference.component';

describe('SettingPreferenceComponent', () => {
  let component: SettingPreferenceComponent;
  let fixture: ComponentFixture<SettingPreferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingPreferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingPreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
