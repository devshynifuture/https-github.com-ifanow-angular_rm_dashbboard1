import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralInsuranceMobComponent } from './general-insurance-mob.component';

describe('GeneralInsuranceMobComponent', () => {
  let component: GeneralInsuranceMobComponent;
  let fixture: ComponentFixture<GeneralInsuranceMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralInsuranceMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralInsuranceMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
