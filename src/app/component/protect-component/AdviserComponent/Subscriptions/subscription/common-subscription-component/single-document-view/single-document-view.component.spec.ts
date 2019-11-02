import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleDocumentViewComponent } from './single-document-view.component';

describe('SingleDocumentViewComponent', () => {
  let component: SingleDocumentViewComponent;
  let fixture: ComponentFixture<SingleDocumentViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleDocumentViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleDocumentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
