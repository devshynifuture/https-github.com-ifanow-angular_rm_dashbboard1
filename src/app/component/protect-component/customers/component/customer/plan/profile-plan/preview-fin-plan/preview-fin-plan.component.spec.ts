import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewFinPlanComponent } from './preview-fin-plan.component';

describe('PreviewFinPlanComponent', () => {
  let component: PreviewFinPlanComponent;
  let fixture: ComponentFixture<PreviewFinPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewFinPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewFinPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
