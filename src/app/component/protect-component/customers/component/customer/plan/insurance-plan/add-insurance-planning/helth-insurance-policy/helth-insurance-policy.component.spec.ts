import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelthInsurancePolicyComponent } from './helth-insurance-policy.component';

describe('HelthInsurancePolicyComponent', () => {
  let component: HelthInsurancePolicyComponent;
  let fixture: ComponentFixture<HelthInsurancePolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelthInsurancePolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelthInsurancePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
