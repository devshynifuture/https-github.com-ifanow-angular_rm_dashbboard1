import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanKeyParametersComponent } from './plan-key-parameters.component';

describe('PlanKeyParametersComponent', () => {
  let component: PlanKeyParametersComponent;
  let fixture: ComponentFixture<PlanKeyParametersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanKeyParametersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanKeyParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
