import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MutualFundSummaryComponent } from './mutual-fund-summary.component';

describe('MutualFundSummaryComponent', () => {
  let component: MutualFundSummaryComponent;
  let fixture: ComponentFixture<MutualFundSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MutualFundSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MutualFundSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
