import { TestBed } from '@angular/core/testing';

import { SubscriptionDataService } from './subscription-data.service';

describe('SubscriptionDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubscriptionDataService = TestBed.get(SubscriptionDataService);
    expect(service).toBeTruthy();
  });
});
