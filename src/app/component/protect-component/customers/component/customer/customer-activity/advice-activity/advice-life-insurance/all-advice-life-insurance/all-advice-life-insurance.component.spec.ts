import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAdviceLifeInsuranceComponent } from './all-advice-life-insurance.component';

describe('AllAdviceLifeInsuranceComponent', () => {
  let component: AllAdviceLifeInsuranceComponent;
  let fixture: ComponentFixture<AllAdviceLifeInsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllAdviceLifeInsuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllAdviceLifeInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
