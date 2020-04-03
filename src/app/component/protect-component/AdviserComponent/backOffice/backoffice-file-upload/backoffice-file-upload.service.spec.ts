import { TestBed } from '@angular/core/testing';

import { BackofficeFileUploadService } from './backoffice-file-upload.service';

describe('BackofficeFileUploadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BackofficeFileUploadService = TestBed.get(BackofficeFileUploadService);
    expect(service).toBeTruthy();
  });
});
