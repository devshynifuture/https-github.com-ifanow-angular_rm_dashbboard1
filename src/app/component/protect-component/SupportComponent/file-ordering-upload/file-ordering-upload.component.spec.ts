import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileOrderingUploadComponent } from './file-ordering-upload.component';

describe('FileOrderingUploadComponent', () => {
  let component: FileOrderingUploadComponent;
  let fixture: ComponentFixture<FileOrderingUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileOrderingUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileOrderingUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
