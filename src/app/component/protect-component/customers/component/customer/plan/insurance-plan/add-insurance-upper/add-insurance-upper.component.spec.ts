import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInsuranceUpperComponent } from './add-insurance-upper.component';

describe('AddInsuranceUpperComponent', () => {
  let component: AddInsuranceUpperComponent;
  let fixture: ComponentFixture<AddInsuranceUpperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInsuranceUpperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInsuranceUpperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
