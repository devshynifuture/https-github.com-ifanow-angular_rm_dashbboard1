import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingCrmComponent } from './setting-crm.component';

describe('SettingCrmComponent', () => {
  let component: SettingCrmComponent;
  let fixture: ComponentFixture<SettingCrmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingCrmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingCrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
