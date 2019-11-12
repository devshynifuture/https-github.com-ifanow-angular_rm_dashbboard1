import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientUpperSubscriptionComponent } from './client-upper-subscription.component';

describe('SubscriptionsUpperSliderComponent', () => {
  let component: ClientUpperSubscriptionComponent;
  let fixture: ComponentFixture<ClientUpperSubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientUpperSubscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientUpperSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
