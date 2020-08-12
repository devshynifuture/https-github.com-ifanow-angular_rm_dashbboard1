import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingSupportPricingSettingComponent } from './setting-support-pricing-setting.component';

describe('SettingSupportPricingSettingComponent', () => {
  let component: SettingSupportPricingSettingComponent;
  let fixture: ComponentFixture<SettingSupportPricingSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingSupportPricingSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingSupportPricingSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
