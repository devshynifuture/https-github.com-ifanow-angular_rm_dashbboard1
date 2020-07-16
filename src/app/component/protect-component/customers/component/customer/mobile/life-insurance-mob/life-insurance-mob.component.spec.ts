import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeInsuranceMobComponent } from './life-insurance-mob.component';

describe('LifeInsuranceMobComponent', () => {
  let component: LifeInsuranceMobComponent;
  let fixture: ComponentFixture<LifeInsuranceMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LifeInsuranceMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LifeInsuranceMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
