import { TestBed, async, inject } from '@angular/core/testing';

import { PlanGuard } from './plan.guard';

describe('PlanGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlanGuard]
    });
  });

  it('should ...', inject([PlanGuard], (guard: PlanGuard) => {
    expect(guard).toBeTruthy();
  }));
});
