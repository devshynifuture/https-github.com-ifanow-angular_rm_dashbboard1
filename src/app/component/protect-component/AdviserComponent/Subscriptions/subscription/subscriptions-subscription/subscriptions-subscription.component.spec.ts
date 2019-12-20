import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionsSubscriptionComponent } from './subscriptions-subscription.component';

describe('SubscriptionsSubscriptionComponent', () => {
  let component: SubscriptionsSubscriptionComponent;
  let fixture: ComponentFixture<SubscriptionsSubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SubscriptionsSubscriptionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionsSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
