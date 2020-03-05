import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FireInsuranceComponent } from './fire-insurance.component';

describe('FireInsuranceComponent', () => {
  let component: FireInsuranceComponent;
  let fixture: ComponentFixture<FireInsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FireInsuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FireInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
