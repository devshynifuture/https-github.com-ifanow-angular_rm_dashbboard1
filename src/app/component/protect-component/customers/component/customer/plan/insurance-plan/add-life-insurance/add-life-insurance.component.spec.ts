import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLifeInsuranceComponent } from './add-life-insurance.component';

describe('AddLifeInsuranceComponent', () => {
  let component: AddLifeInsuranceComponent;
  let fixture: ComponentFixture<AddLifeInsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLifeInsuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLifeInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
