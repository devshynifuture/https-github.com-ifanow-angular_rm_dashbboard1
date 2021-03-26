import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingActivityTabsComponent } from './setting-activity-tabs.component';

describe('SettingActivityTabsComponent', () => {
  let component: SettingActivityTabsComponent;
  let fixture: ComponentFixture<SettingActivityTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingActivityTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingActivityTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
