import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalInsuranceComponent } from './personal-insurance.component';

describe('PersonalInsuranceComponent', () => {
  let component: PersonalInsuranceComponent;
  let fixture: ComponentFixture<PersonalInsuranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalInsuranceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
