import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetAllocationPieChartComponent } from './asset-allocation-pie-chart.component';

describe('AssetAllocationPieChartComponent', () => {
  let component: AssetAllocationPieChartComponent;
  let fixture: ComponentFixture<AssetAllocationPieChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetAllocationPieChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetAllocationPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
