import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedViewInsurancePlanningComponent } from './detailed-view-insurance-planning.component';

describe('DetailedViewInsurancePlanningComponent', () => {
  let component: DetailedViewInsurancePlanningComponent;
  let fixture: ComponentFixture<DetailedViewInsurancePlanningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedViewInsurancePlanningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedViewInsurancePlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
