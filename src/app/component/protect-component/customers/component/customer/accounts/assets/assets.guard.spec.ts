import { TestBed, async, inject } from '@angular/core/testing';

import { AssetsGuard } from './assets.guard';

describe('AssetsGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssetsGuard]
    });
  });

  it('should ...', inject([AssetsGuard], (guard: AssetsGuard) => {
    expect(guard).toBeTruthy();
  }));
});
