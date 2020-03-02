import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupTaxPlanningComponent } from './setup-tax-planning.component';

describe('SetupTaxPlanningComponent', () => {
  let component: SetupTaxPlanningComponent;
  let fixture: ComponentFixture<SetupTaxPlanningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetupTaxPlanningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupTaxPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
