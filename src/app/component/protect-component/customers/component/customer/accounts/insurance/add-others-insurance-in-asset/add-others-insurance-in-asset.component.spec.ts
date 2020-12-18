import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOthersInsuranceInAssetComponent } from './add-others-insurance-in-asset.component';

describe('AddOthersInsuranceInAssetComponent', () => {
  let component: AddOthersInsuranceInAssetComponent;
  let fixture: ComponentFixture<AddOthersInsuranceInAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOthersInsuranceInAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOthersInsuranceInAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
