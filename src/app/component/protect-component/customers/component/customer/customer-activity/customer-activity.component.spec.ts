import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerActivityComponent } from './customer-activity.component';

describe('CustomerActivityComponent', () => {
  let component: CustomerActivityComponent;
  let fixture: ComponentFixture<CustomerActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
