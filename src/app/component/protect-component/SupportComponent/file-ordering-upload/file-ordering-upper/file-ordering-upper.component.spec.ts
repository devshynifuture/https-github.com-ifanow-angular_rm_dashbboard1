import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileOrderingUpperComponent } from './file-ordering-upper.component';

describe('FileOrderingUpperComponent', () => {
  let component: FileOrderingUpperComponent;
  let fixture: ComponentFixture<FileOrderingUpperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileOrderingUpperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileOrderingUpperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
