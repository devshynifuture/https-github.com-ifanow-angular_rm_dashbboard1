import { TestBed } from '@angular/core/testing';

import { CancelFlagService } from './cancel-flag.service';

describe('CancelFlagService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CancelFlagService = TestBed.get(CancelFlagService);
    expect(service).toBeTruthy();
  });
});
