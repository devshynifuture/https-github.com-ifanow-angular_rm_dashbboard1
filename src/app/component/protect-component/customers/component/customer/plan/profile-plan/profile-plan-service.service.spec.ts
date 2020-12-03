import { TestBed } from '@angular/core/testing';

import { ProfilePlanServiceService } from './profile-plan-service.service';

describe('ProfilePlanServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProfilePlanServiceService = TestBed.get(ProfilePlanServiceService);
    expect(service).toBeTruthy();
  });
});
