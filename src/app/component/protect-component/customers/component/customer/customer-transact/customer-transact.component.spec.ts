import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTransactComponent } from './customer-transact.component';

describe('CustomerTransactComponent', () => {
  let component: CustomerTransactComponent;
  let fixture: ComponentFixture<CustomerTransactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerTransactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerTransactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
