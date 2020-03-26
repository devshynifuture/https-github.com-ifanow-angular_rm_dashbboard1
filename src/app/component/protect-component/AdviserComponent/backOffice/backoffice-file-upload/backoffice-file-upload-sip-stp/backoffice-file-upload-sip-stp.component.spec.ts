import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeFileUploadSipStpComponent } from './backoffice-file-upload-sip-stp.component';

describe('BackofficeFileUploadSipStpComponent', () => {
  let component: BackofficeFileUploadSipStpComponent;
  let fixture: ComponentFixture<BackofficeFileUploadSipStpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackofficeFileUploadSipStpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficeFileUploadSipStpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
