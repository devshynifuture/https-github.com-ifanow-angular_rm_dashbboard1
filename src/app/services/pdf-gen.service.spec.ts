import { TestBed } from '@angular/core/testing';

import { PdfGenService } from './pdf-gen.service';

describe('PdfGenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PdfGenService = TestBed.get(PdfGenService);
    expect(service).toBeTruthy();
  });
});
