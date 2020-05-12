import { TestBed } from '@angular/core/testing';

import { ExcelMisSipService } from './excel-mis-sip.service';

describe('ExcelMisSipService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExcelMisSipService = TestBed.get(ExcelMisSipService);
    expect(service).toBeTruthy();
  });
});
