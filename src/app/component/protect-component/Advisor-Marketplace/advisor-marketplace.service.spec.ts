import { TestBed } from '@angular/core/testing';

import { AdvisorMarketplaceService } from './advisor-marketplace.service';

describe('AdvisorMarketplaceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdvisorMarketplaceService = TestBed.get(AdvisorMarketplaceService);
    expect(service).toBeTruthy();
  });
});
