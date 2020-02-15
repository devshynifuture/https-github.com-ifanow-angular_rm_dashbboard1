import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanTemplatesComponent } from './plan-templates.component';

describe('PlanTemplatesComponent', () => {
  let component: PlanTemplatesComponent;
  let fixture: ComponentFixture<PlanTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
