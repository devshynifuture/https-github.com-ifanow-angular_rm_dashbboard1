import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanReturnsinflationComponent } from './plan-returnsinflation.component';

describe('PlanReturnsinflationComponent', () => {
  let component: PlanReturnsinflationComponent;
  let fixture: ComponentFixture<PlanReturnsinflationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanReturnsinflationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanReturnsinflationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
