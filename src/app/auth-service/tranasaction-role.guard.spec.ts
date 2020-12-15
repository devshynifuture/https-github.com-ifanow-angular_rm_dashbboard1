import { TestBed, async, inject } from '@angular/core/testing';

import { TransactionRoleGuard } from './transaction-role-guard.service';

describe('TranasactionRoleGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransactionRoleGuard]
    });
  });

  it('should ...', inject([TransactionRoleGuard], (guard: TransactionRoleGuard) => {
    expect(guard).toBeTruthy();
  }));
});
