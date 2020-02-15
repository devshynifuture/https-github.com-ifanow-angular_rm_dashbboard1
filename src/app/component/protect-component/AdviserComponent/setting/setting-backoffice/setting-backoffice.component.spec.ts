import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingBackofficeComponent } from './setting-backoffice.component';

describe('SettingBackofficeComponent', () => {
  let component: SettingBackofficeComponent;
  let fixture: ComponentFixture<SettingBackofficeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingBackofficeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingBackofficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
