import { TestBed } from '@angular/core/testing';

import { CustomerOverviewService } from './customer-overview.service';

describe('CustomerOverviewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomerOverviewService = TestBed.get(CustomerOverviewService);
    expect(service).toBeTruthy();
  });
});
