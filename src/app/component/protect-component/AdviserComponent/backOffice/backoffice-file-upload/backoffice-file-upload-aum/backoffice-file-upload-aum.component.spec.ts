import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeFileUploadAumComponent } from './backoffice-file-upload-aum.component';

describe('BackofficeFileUploadAumComponent', () => {
  let component: BackofficeFileUploadAumComponent;
  let fixture: ComponentFixture<BackofficeFileUploadAumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackofficeFileUploadAumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficeFileUploadAumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
