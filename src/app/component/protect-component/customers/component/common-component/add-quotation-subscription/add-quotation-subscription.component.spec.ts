import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQuotationSubscriptionComponent } from './add-quotation-subscription.component';

describe('AddQuotationSubscriptionComponent', () => {
  let component: AddQuotationSubscriptionComponent;
  let fixture: ComponentFixture<AddQuotationSubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddQuotationSubscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddQuotationSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
