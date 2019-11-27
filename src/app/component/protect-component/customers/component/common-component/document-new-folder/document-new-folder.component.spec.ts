import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentNewFolderComponent } from './document-new-folder.component';

describe('DocumentNewFolderComponent', () => {
  let component: DocumentNewFolderComponent;
  let fixture: ComponentFixture<DocumentNewFolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentNewFolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentNewFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
