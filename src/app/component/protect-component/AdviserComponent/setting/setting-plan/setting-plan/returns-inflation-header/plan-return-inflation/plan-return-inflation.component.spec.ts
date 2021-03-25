import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanReturnInflationComponent } from './plan-return-inflation.component';

describe('PlanReturnInflationComponent', () => {
  let component: PlanReturnInflationComponent;
  let fixture: ComponentFixture<PlanReturnInflationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanReturnInflationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanReturnInflationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
