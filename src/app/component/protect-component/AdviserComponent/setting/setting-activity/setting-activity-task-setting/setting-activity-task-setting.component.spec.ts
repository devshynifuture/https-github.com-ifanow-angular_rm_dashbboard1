import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingActivityTaskSettingComponent } from './setting-activity-task-setting.component';

describe('SettingActivityTaskSettingComponent', () => {
  let component: SettingActivityTaskSettingComponent;
  let fixture: ComponentFixture<SettingActivityTaskSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingActivityTaskSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingActivityTaskSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
