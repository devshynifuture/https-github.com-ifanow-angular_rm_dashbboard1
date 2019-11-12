import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionUpperSliderComponent } from './subscription-upper-slider.component';

describe('UpperSliderComponent', () => {
  let component: SubscriptionUpperSliderComponent;
  let fixture: ComponentFixture<SubscriptionUpperSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionUpperSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionUpperSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
