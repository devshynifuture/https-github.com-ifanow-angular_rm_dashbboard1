import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdviceGeneralInsuranceComponent } from './advice-general-insurance.component';

describe('AdviceGeneralInsuranceComponent', () => {
  let component: AdviceGeneralInsuranceComponent;
  let fixture: ComponentFixture<AdviceGeneralInsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdviceGeneralInsuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdviceGeneralInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
