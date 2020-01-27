import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInsurancePlanningComponent } from './add-insurance-planning.component';

describe('AddInsurancePlanningComponent', () => {
  let component: AddInsurancePlanningComponent;
  let fixture: ComponentFixture<AddInsurancePlanningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInsurancePlanningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInsurancePlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
