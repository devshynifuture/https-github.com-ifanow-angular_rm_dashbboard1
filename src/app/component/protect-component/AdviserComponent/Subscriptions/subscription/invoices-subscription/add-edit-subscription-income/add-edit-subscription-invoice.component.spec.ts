import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AddEditSubscriptionInvoiceComponent} from './add-edit-subscription-invoice.component';

describe('AddEditSubscriptionIncomeComponent', () => {
  let component: AddEditSubscriptionInvoiceComponent;
  let fixture: ComponentFixture<AddEditSubscriptionInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditSubscriptionInvoiceComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditSubscriptionInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
