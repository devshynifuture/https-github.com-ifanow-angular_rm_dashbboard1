import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsDocumentsComponent } from './accounts-documents.component';

describe('AccountsDocumentsComponent', () => {
  let component: AccountsDocumentsComponent;
  let fixture: ComponentFixture<AccountsDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountsDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountsDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
