import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRetrirementAssetComponent } from './all-retrirement-asset.component';

describe('AllRetrirementAssetComponent', () => {
  let component: AllRetrirementAssetComponent;
  let fixture: ComponentFixture<AllRetrirementAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllRetrirementAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllRetrirementAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
