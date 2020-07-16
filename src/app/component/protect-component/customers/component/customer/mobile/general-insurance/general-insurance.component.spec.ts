import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralInsuranceComponent } from './general-insurance.component';

describe('GeneralInsuranceComponent', () => {
  let component: GeneralInsuranceComponent;
  let fixture: ComponentFixture<GeneralInsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralInsuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
