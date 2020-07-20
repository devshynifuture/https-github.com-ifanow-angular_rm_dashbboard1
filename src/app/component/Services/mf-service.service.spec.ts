import { TestBed } from '@angular/core/testing';

import { MfServiceService } from './mf-service.service';

describe('MfServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MfServiceService = TestBed.get(MfServiceService);
    expect(service).toBeTruthy();
  });
});
