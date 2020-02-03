import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAdviceRealAssetComponent } from './all-advice-real-asset.component';

describe('AllAdviceRealAssetComponent', () => {
  let component: AllAdviceRealAssetComponent;
  let fixture: ComponentFixture<AllAdviceRealAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllAdviceRealAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllAdviceRealAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
