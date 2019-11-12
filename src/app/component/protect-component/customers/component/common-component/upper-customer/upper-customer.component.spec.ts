import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpperCustomerComponent } from './upper-customer.component';

describe('UpperCustomerComponent', () => {
  let component: UpperCustomerComponent;
  let fixture: ComponentFixture<UpperCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpperCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpperCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
