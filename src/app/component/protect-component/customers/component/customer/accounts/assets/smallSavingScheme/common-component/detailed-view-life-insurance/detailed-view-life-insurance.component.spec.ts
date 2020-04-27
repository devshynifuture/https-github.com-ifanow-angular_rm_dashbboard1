import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedViewLifeInsuranceComponent } from './detailed-view-life-insurance.component';

describe('DetailedViewLifeInsuranceComponent', () => {
  let component: DetailedViewLifeInsuranceComponent;
  let fixture: ComponentFixture<DetailedViewLifeInsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedViewLifeInsuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedViewLifeInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
