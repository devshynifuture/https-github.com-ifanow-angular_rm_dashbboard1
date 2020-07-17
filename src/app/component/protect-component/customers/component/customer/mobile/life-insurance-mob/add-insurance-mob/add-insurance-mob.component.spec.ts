import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInsuranceMobComponent } from './add-insurance-mob.component';

describe('AddInsuranceMobComponent', () => {
  let component: AddInsuranceMobComponent;
  let fixture: ComponentFixture<AddInsuranceMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInsuranceMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInsuranceMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
