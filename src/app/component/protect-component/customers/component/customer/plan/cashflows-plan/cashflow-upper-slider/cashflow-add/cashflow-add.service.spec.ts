import { TestBed } from '@angular/core/testing';

import { CashflowAddService } from './cashflow-add.service';

describe('CashflowAddService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CashflowAddService = TestBed.get(CashflowAddService);
    expect(service).toBeTruthy();
  });
});
