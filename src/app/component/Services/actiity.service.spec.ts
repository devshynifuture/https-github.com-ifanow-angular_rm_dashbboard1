import { TestBed } from '@angular/core/testing';

import { ActiityService } from './actiity.service';

describe('ActiityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActiityService = TestBed.get(ActiityService);
    expect(service).toBeTruthy();
  });
});
