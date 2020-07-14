import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditDocumentMobileViewComponent } from './add-edit-document-mobile-view.component';

describe('AddEditDocumentMobileViewComponent', () => {
  let component: AddEditDocumentMobileViewComponent;
  let fixture: ComponentFixture<AddEditDocumentMobileViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditDocumentMobileViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditDocumentMobileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
