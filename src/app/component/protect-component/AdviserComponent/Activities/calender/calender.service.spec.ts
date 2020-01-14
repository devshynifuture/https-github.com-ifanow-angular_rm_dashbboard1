import { TestBed } from '@angular/core/testing';

import { CalenderService } from './calender.service';

describe('CalenderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CalenderService = TestBed.get(CalenderService);
    expect(service).toBeTruthy();
  });
});
