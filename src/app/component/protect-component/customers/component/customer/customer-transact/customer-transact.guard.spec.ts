import { TestBed, async, inject } from '@angular/core/testing';

import { CustomerTransactGuard } from './customer-transact.guard';

describe('CustomerTransactGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerTransactGuard]
    });
  });

  it('should ...', inject([CustomerTransactGuard], (guard: CustomerTransactGuard) => {
    expect(guard).toBeTruthy();
  }));
});
