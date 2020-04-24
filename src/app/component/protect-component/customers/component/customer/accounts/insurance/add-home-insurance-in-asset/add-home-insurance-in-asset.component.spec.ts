import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHomeInsuranceInAssetComponent } from './add-home-insurance-in-asset.component';

describe('AddHomeInsuranceInAssetComponent', () => {
  let component: AddHomeInsuranceInAssetComponent;
  let fixture: ComponentFixture<AddHomeInsuranceInAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddHomeInsuranceInAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHomeInsuranceInAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
