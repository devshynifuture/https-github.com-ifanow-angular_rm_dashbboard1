import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingActivityTaskTemplatesComponent } from './setting-activity-task-templates.component';

describe('SettingActivityTaskTemplatesComponent', () => {
  let component: SettingActivityTaskTemplatesComponent;
  let fixture: ComponentFixture<SettingActivityTaskTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingActivityTaskTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingActivityTaskTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
