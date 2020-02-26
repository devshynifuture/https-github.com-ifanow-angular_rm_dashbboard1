import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileOrderingDetailComponent } from './file-ordering-detail.component';

describe('FileOrderingDetailComponent', () => {
  let component: FileOrderingDetailComponent;
  let fixture: ComponentFixture<FileOrderingDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileOrderingDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileOrderingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
