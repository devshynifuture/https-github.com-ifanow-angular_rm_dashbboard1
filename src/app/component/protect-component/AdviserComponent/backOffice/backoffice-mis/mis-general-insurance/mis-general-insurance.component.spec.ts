import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisGeneralInsuranceComponent } from './mis-general-insurance.component';

describe('MisGeneralInsuranceComponent', () => {
  let component: MisGeneralInsuranceComponent;
  let fixture: ComponentFixture<MisGeneralInsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisGeneralInsuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisGeneralInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
