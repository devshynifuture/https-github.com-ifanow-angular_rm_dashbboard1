import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedViewOthersAssetComponent } from './detailed-view-others-asset.component';

describe('DetailedViewOthersAssetComponent', () => {
  let component: DetailedViewOthersAssetComponent;
  let fixture: ComponentFixture<DetailedViewOthersAssetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedViewOthersAssetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedViewOthersAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
