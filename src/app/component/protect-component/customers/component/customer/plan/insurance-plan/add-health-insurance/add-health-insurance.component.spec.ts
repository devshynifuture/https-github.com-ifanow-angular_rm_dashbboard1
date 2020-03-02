import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHealthInsuranceComponent } from './add-health-insurance.component';

describe('AddHealthInsuranceComponent', () => {
  let component: AddHealthInsuranceComponent;
  let fixture: ComponentFixture<AddHealthInsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddHealthInsuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHealthInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
