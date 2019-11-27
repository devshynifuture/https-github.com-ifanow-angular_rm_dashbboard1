import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPlaninsuranceComponent } from './add-planinsurance.component';

describe('AddPlaninsuranceComponent', () => {
  let component: AddPlaninsuranceComponent;
  let fixture: ComponentFixture<AddPlaninsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPlaninsuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlaninsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
