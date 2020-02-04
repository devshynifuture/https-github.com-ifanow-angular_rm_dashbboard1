import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationTransactionComponent } from './confirmation-transaction.component';

describe('ConfirmationTransactionComponent', () => {
  let component: ConfirmationTransactionComponent;
  let fixture: ComponentFixture<ConfirmationTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
