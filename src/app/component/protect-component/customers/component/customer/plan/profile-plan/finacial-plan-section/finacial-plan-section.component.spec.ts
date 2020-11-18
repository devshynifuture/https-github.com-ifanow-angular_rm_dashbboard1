import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinacialPlanSectionComponent } from './finacial-plan-section.component';

describe('FinacialPlanSectionComponent', () => {
  let component: FinacialPlanSectionComponent;
  let fixture: ComponentFixture<FinacialPlanSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinacialPlanSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinacialPlanSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
