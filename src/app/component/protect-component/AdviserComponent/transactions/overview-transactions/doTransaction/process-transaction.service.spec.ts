import { TestBed } from '@angular/core/testing';

import { ProcessTransactionService } from './process-transaction.service';

describe('ProcessTransactionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProcessTransactionService = TestBed.get(ProcessTransactionService);
    expect(service).toBeTruthy();
  });
});
