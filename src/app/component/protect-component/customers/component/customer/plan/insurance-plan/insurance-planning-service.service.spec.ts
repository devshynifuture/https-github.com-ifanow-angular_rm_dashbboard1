import { TestBed } from '@angular/core/testing';

import { InsurancePlanningServiceService } from './insurance-planning-service.service';

describe('InsurancePlanningServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InsurancePlanningServiceService = TestBed.get(InsurancePlanningServiceService);
    expect(service).toBeTruthy();
  });
});
