import { TestBed } from '@angular/core/testing';

import { OrgSettingServiceService } from './org-setting-service.service';

describe('OrgSettingServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrgSettingServiceService = TestBed.get(OrgSettingServiceService);
    expect(service).toBeTruthy();
  });
});
