import { TestBed } from '@angular/core/testing';

import { ExcelGenService } from './excel-gen.service';

describe('ExcelGenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExcelGenService = TestBed.get(ExcelGenService);
    expect(service).toBeTruthy();
  });
});
