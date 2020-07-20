import { TestBed } from '@angular/core/testing';

import { EnumServiceService } from './enum-service.service';

describe('EnumServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnumServiceService = TestBed.get(EnumServiceService);
    expect(service).toBeTruthy();
  });
});
