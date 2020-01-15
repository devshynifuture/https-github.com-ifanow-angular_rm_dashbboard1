import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSubscriptionIncomeComponent } from './add-edit-subscription-income.component';

describe('AddEditSubscriptionIncomeComponent', () => {
  let component: AddEditSubscriptionIncomeComponent;
  let fixture: ComponentFixture<AddEditSubscriptionIncomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditSubscriptionIncomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditSubscriptionIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
