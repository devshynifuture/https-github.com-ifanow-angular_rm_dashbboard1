import { TestBed } from '@angular/core/testing';

import { ExcelClientListService } from './excel-client-list.service';

describe('ExcelClientListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExcelClientListService = TestBed.get(ExcelClientListService);
    expect(service).toBeTruthy();
  });
});
