import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeFileUploadFolioComponent } from './backoffice-file-upload-folio.component';

describe('BackofficeFileUploadFolioComponent', () => {
  let component: BackofficeFileUploadFolioComponent;
  let fixture: ComponentFixture<BackofficeFileUploadFolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackofficeFileUploadFolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficeFileUploadFolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
