import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancerInsuranceComponent } from './cancer-insurance.component';

describe('CancerInsuranceComponent', () => {
  let component: CancerInsuranceComponent;
  let fixture: ComponentFixture<CancerInsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancerInsuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancerInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
