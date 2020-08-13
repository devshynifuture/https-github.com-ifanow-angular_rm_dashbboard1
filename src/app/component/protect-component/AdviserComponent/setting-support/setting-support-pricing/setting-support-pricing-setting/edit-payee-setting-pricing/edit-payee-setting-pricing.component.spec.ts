import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPayeeSettingPricingComponent } from './edit-payee-setting-pricing.component';

describe('EditPayeeSettingPricingComponent', () => {
  let component: EditPayeeSettingPricingComponent;
  let fixture: ComponentFixture<EditPayeeSettingPricingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPayeeSettingPricingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPayeeSettingPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
