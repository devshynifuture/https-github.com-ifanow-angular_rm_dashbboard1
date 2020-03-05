import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HouseholdersInsuranceComponent } from './householders-insurance.component';

describe('HouseholdersInsuranceComponent', () => {
  let component: HouseholdersInsuranceComponent;
  let fixture: ComponentFixture<HouseholdersInsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HouseholdersInsuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseholdersInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
