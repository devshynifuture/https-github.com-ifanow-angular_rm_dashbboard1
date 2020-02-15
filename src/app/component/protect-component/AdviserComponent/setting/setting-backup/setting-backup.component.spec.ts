import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingBackupComponent } from './setting-backup.component';

describe('SettingBackupComponent', () => {
  let component: SettingBackupComponent;
  let fixture: ComponentFixture<SettingBackupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingBackupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingBackupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
