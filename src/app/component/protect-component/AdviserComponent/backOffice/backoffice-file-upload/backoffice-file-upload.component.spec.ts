import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeFileUploadComponent } from './backoffice-file-upload.component';

describe('BackofficeFileUploadComponent', () => {
  let component: BackofficeFileUploadComponent;
  let fixture: ComponentFixture<BackofficeFileUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackofficeFileUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficeFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
