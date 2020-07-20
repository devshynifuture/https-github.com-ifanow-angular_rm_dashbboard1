import { TestBed } from '@angular/core/testing';

import { PostalService } from './postal.service';

describe('PostalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PostalService = TestBed.get(PostalService);
    expect(service).toBeTruthy();
  });
});
