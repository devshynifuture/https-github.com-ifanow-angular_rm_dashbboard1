import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainSettingPopupComponent } from './domain-setting-popup.component';

describe('DomainSettingPopupComponent', () => {
  let component: DomainSettingPopupComponent;
  let fixture: ComponentFixture<DomainSettingPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomainSettingPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainSettingPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
