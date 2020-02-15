import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanAssetallocationComponent } from './plan-assetallocation.component';

describe('PlanAssetallocationComponent', () => {
  let component: PlanAssetallocationComponent;
  let fixture: ComponentFixture<PlanAssetallocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanAssetallocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanAssetallocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
