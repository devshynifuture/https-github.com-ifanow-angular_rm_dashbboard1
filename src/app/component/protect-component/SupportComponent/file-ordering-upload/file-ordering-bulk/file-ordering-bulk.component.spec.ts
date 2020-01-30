import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileOrderingBulkComponent } from './file-ordering-bulk.component';

describe('FileOrderingBulkComponent', () => {
  let component: FileOrderingBulkComponent;
  let fixture: ComponentFixture<FileOrderingBulkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileOrderingBulkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileOrderingBulkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
