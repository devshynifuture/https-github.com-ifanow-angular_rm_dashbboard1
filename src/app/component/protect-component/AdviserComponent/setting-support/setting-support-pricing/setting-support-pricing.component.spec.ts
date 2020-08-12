import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingSupportPricingComponent } from './setting-support-pricing.component';

describe('SettingSupportPricingComponent', () => {
  let component: SettingSupportPricingComponent;
  let fixture: ComponentFixture<SettingSupportPricingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingSupportPricingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingSupportPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
