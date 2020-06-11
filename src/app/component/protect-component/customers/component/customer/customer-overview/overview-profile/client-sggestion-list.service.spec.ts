import { TestBed } from '@angular/core/testing';

import { ClientSggestionListService } from './client-sggestion-list.service';

describe('ClientSggestionListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClientSggestionListService = TestBed.get(ClientSggestionListService);
    expect(service).toBeTruthy();
  });
});
