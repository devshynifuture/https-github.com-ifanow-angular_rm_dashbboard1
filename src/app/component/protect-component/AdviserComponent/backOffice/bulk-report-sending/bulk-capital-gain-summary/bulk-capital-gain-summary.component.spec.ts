import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkCapitalGainSummaryComponent } from './bulk-capital-gain-summary.component';

describe('BulkCapitalGainSummaryComponent', () => {
  let component: BulkCapitalGainSummaryComponent;
  let fixture: ComponentFixture<BulkCapitalGainSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkCapitalGainSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkCapitalGainSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
