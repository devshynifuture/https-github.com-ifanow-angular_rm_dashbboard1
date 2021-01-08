import { TestBed, async, inject } from '@angular/core/testing';

import { CustomerOverviewGuard } from './customer-overview.guard';

describe('CustomerOverviewGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerOverviewGuard]
    });
  });

  it('should ...', inject([CustomerOverviewGuard], (guard: CustomerOverviewGuard) => {
    expect(guard).toBeTruthy();
  }));
});
