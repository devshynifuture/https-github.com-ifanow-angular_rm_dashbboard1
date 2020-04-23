import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFireAndPerilsInsuranceInAssetComponent } from './add-fire-and-perils-insurance-in-asset.component';

describe('AddFireAndPerilsInsuranceInAssetComponent', () => {
  let component: AddFireAndPerilsInsuranceInAssetComponent;
  let fixture: ComponentFixture<AddFireAndPerilsInsuranceInAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFireAndPerilsInsuranceInAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFireAndPerilsInsuranceInAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
