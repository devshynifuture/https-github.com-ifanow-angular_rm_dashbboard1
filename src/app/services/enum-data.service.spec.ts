import { TestBed } from '@angular/core/testing';

import { EnumDataService } from './enum-data.service';

describe('EnumDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnumDataService = TestBed.get(EnumDataService);
    expect(service).toBeTruthy();
  });
});
