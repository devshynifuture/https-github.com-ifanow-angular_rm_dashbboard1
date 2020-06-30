import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomiseSettingComponent } from './customise-setting.component';

describe('CustomiseSettingComponent', () => {
  let component: CustomiseSettingComponent;
  let fixture: ComponentFixture<CustomiseSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomiseSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomiseSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
