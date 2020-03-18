import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewSubscriptionComponent } from './overview-subscription.component';

describe('OverviewSubscriptionComponent', () => {
  let component: OverviewSubscriptionComponent;
  let fixture: ComponentFixture<OverviewSubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverviewSubscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
