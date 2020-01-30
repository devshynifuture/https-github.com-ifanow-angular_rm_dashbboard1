import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdviceLifeInsuranceComponent } from './advice-life-insurance.component';

describe('AdviceLifeInsuranceComponent', () => {
  let component: AdviceLifeInsuranceComponent;
  let fixture: ComponentFixture<AdviceLifeInsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdviceLifeInsuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdviceLifeInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
