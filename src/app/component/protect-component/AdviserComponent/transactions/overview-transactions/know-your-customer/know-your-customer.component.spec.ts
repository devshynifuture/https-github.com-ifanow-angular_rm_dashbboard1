import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowYourCustomerComponent } from './know-your-customer.component';

describe('KnowYourCustomerComponent', () => {
  let component: KnowYourCustomerComponent;
  let fixture: ComponentFixture<KnowYourCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KnowYourCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KnowYourCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
