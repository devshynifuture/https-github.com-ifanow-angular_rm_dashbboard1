import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionBottomButtonComponent } from './transaction-bottom-button.component';

describe('TransactionBottomButtonComponent', () => {
  let component: TransactionBottomButtonComponent;
  let fixture: ComponentFixture<TransactionBottomButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionBottomButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionBottomButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
