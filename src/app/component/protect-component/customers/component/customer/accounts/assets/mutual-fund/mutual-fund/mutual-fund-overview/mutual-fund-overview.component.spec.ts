import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MutualFundOverviewComponent } from './mutual-fund-overview.component';

describe('MutualFundOverviewComponent', () => {
  let component: MutualFundOverviewComponent;
  let fixture: ComponentFixture<MutualFundOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MutualFundOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MutualFundOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
