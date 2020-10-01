import { TestBed } from '@angular/core/testing';

import { StockPdfService } from './stock-pdf.service';

describe('StockPdfService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StockPdfService = TestBed.get(StockPdfService);
    expect(service).toBeTruthy();
  });
});
