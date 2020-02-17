import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftsidebarSettingComponent } from './leftsidebar-setting.component';

describe('LeftsidebarSettingComponent', () => {
  let component: LeftsidebarSettingComponent;
  let fixture: ComponentFixture<LeftsidebarSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftsidebarSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftsidebarSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
