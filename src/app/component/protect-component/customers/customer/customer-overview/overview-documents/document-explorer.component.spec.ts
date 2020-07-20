import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DocumentExplorerComponent} from './document-explorer.component';

describe('DocumentsComponent', () => {
  let component: DocumentExplorerComponent;
  let fixture: ComponentFixture<DocumentExplorerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentExplorerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
