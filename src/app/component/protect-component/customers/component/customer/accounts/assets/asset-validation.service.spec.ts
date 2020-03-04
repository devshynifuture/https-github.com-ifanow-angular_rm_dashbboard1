import { TestBed } from '@angular/core/testing';

import { AssetValidationService } from './asset-validation.service';

describe('AssetValidationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AssetValidationService = TestBed.get(AssetValidationService);
    expect(service).toBeTruthy();
  });
});
