import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisLifeInsuranceComponent } from './mis-life-insurance.component';

describe('MisLifeInsuranceComponent', () => {
  let component: MisLifeInsuranceComponent;
  let fixture: ComponentFixture<MisLifeInsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisLifeInsuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisLifeInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
