import { TestBed } from '@angular/core/testing';

import { AdviceUtilsService } from './advice-utils.service';

describe('AdviceUtilsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdviceUtilsService = TestBed.get(AdviceUtilsService);
    expect(service).toBeTruthy();
  });
});
