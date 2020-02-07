import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLifeInsuranceMasterComponent } from './add-life-insurance-master.component';

describe('AddLifeInsuranceMasterComponent', () => {
  let component: AddLifeInsuranceMasterComponent;
  let fixture: ComponentFixture<AddLifeInsuranceMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLifeInsuranceMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLifeInsuranceMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
