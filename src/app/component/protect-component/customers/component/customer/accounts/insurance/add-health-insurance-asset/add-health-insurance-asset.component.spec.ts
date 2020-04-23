import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHealthInsuranceAssetComponent } from './add-health-insurance-asset.component';

describe('AddHealthInsuranceAssetComponent', () => {
  let component: AddHealthInsuranceAssetComponent;
  let fixture: ComponentFixture<AddHealthInsuranceAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddHealthInsuranceAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHealthInsuranceAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
