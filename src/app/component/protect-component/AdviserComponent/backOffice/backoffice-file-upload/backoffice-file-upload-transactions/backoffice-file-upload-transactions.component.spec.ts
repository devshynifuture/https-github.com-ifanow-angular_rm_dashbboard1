import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeFileUploadTransactionsComponent } from './backoffice-file-upload-transactions.component';

describe('BackofficeFileUploadTransactionsComponent', () => {
  let component: BackofficeFileUploadTransactionsComponent;
  let fixture: ComponentFixture<BackofficeFileUploadTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackofficeFileUploadTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficeFileUploadTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
