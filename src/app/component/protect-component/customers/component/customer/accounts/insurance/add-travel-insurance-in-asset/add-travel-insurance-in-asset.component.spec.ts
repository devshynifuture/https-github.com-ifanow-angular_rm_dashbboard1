import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTravelInsuranceInAssetComponent } from './add-travel-insurance-in-asset.component';

describe('AddTravelInsuranceInAssetComponent', () => {
  let component: AddTravelInsuranceInAssetComponent;
  let fixture: ComponentFixture<AddTravelInsuranceInAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTravelInsuranceInAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTravelInsuranceInAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
