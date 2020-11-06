import { TestBed } from '@angular/core/testing';

import { SummaryPlanServiceService } from './summary-plan-service.service';

describe('SummaryPlanServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SummaryPlanServiceService = TestBed.get(SummaryPlanServiceService);
    expect(service).toBeTruthy();
  });
});
