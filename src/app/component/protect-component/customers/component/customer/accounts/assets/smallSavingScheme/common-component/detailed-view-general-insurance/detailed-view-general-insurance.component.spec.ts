import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedViewGeneralInsuranceComponent } from './detailed-view-general-insurance.component';

describe('DetailedViewGeneralInsuranceComponent', () => {
  let component: DetailedViewGeneralInsuranceComponent;
  let fixture: ComponentFixture<DetailedViewGeneralInsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedViewGeneralInsuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedViewGeneralInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
