import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingSchemeDetailsComponent } from './setting-scheme-details.component';

describe('SettingSchemeDetailsComponent', () => {
  let component: SettingSchemeDetailsComponent;
  let fixture: ComponentFixture<SettingSchemeDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingSchemeDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingSchemeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
