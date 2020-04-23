import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMotorInsuranceInAssetComponent } from './add-motor-insurance-in-asset.component';

describe('AddMotorInsuranceInAssetComponent', () => {
  let component: AddMotorInsuranceInAssetComponent;
  let fixture: ComponentFixture<AddMotorInsuranceInAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMotorInsuranceInAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMotorInsuranceInAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
