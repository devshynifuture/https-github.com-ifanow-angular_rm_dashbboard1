import { TestBed, async, inject } from '@angular/core/testing';

import { BackOfficeGuard } from './back-office.guard';

describe('BackOfficeGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BackOfficeGuard]
    });
  });

  it('should ...', inject([BackOfficeGuard], (guard: BackOfficeGuard) => {
    expect(guard).toBeTruthy();
  }));
});
