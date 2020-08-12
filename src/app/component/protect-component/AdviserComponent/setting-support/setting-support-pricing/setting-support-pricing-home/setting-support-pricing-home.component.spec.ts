import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingSupportPricingHomeComponent } from './setting-support-pricing-home.component';

describe('SettingSupportPricingHomeComponent', () => {
  let component: SettingSupportPricingHomeComponent;
  let fixture: ComponentFixture<SettingSupportPricingHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingSupportPricingHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingSupportPricingHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
