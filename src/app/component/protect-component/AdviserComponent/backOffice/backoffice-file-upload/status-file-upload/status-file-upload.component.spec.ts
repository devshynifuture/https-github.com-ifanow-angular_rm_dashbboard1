import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusFileUploadComponent } from './status-file-upload.component';

describe('StatusFileUploadComponent', () => {
  let component: StatusFileUploadComponent;
  let fixture: ComponentFixture<StatusFileUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusFileUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
