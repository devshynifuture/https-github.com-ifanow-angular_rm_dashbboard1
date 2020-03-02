import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRetirementAssetComponent } from './all-retirement-asset.component';

describe('AllRetirementAssetComponent', () => {
  let component: AllRetirementAssetComponent;
  let fixture: ComponentFixture<AllRetirementAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AllRetirementAssetComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllRetirementAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
