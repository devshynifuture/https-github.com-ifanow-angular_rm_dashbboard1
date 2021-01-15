import { TestBed } from '@angular/core/testing';

import { PortfolioSummaryService } from './portfolio-summary.service';

describe('PortfolioSummaryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PortfolioSummaryService = TestBed.get(PortfolioSummaryService);
    expect(service).toBeTruthy();
  });
});
