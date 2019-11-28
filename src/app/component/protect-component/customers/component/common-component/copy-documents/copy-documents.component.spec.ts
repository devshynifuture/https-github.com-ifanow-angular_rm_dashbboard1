import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyDocumentsComponent } from './copy-documents.component';

describe('CopyDocumentsComponent', () => {
  let component: CopyDocumentsComponent;
  let fixture: ComponentFixture<CopyDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
