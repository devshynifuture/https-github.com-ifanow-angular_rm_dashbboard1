import { TestBed } from '@angular/core/testing';

import { ReferEarnService } from './refer-earn.service';

describe('ReferEarnService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReferEarnService = TestBed.get(ReferEarnService);
    expect(service).toBeTruthy();
  });
});
