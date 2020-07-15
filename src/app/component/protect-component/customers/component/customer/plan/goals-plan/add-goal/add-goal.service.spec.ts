import { TestBed } from '@angular/core/testing';

import { AddGoalService } from './add-goal.service';

describe('AddGoalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AddGoalService = TestBed.get(AddGoalService);
    expect(service).toBeTruthy();
  });
});
