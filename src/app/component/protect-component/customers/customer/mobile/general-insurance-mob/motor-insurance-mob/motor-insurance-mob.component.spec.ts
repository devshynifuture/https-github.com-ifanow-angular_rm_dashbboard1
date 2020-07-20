import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotorInsuranceMobComponent } from './motor-insurance-mob.component';

describe('MotorInsuranceMobComponent', () => {
  let component: MotorInsuranceMobComponent;
  let fixture: ComponentFixture<MotorInsuranceMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotorInsuranceMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotorInsuranceMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
