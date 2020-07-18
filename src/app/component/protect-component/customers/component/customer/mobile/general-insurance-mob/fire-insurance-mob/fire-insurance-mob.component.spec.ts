import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FireInsuranceMobComponent } from './fire-insurance-mob.component';

describe('FireInsuranceMobComponent', () => {
  let component: FireInsuranceMobComponent;
  let fixture: ComponentFixture<FireInsuranceMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FireInsuranceMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FireInsuranceMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
