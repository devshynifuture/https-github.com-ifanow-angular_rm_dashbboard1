import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelInsuranceMobComponent } from './travel-insurance-mob.component';

describe('TravelInsuranceMobComponent', () => {
  let component: TravelInsuranceMobComponent;
  let fixture: ComponentFixture<TravelInsuranceMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelInsuranceMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelInsuranceMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
