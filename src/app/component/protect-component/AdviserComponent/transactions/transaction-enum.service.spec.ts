import { TestBed } from '@angular/core/testing';

import { TransactionEnumService } from './transaction-enum.service';

describe('TransactionEnumService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransactionEnumService = TestBed.get(TransactionEnumService);
    expect(service).toBeTruthy();
  });
});
