import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDocumentsComponent } from './documents.component';

describe('DocumentsComponent', () => {
  let component: ClientDocumentsComponent;
  let fixture: ComponentFixture<ClientDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
