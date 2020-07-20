import { TestBed } from '@angular/core/testing';

import { OnlineTransactionService } from './online-transaction.service';

describe('OnlineTransactionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OnlineTransactionService = TestBed.get(OnlineTransactionService);
    expect(service).toBeTruthy();
  });
});
