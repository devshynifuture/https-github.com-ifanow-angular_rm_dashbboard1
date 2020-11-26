import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAdviceGeneralInsuranceComponent } from './all-advice-general-insurance.component';

describe('AllAdviceGeneralInsuranceComponent', () => {
  let component: AllAdviceGeneralInsuranceComponent;
  let fixture: ComponentFixture<AllAdviceGeneralInsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllAdviceGeneralInsuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllAdviceGeneralInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
