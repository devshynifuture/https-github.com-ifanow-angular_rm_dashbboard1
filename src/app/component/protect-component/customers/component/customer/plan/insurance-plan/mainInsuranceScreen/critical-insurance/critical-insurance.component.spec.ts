import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CriticalInsuranceComponent } from './critical-insurance.component';

describe('CriticalInsuranceComponent', () => {
  let component: CriticalInsuranceComponent;
  let fixture: ComponentFixture<CriticalInsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CriticalInsuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CriticalInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
