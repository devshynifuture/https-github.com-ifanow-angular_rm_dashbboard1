import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NpsSummaryPortfolioComponent } from './nps-summary-portfolio.component';

describe('NpsSummaryPortfolioComponent', () => {
  let component: NpsSummaryPortfolioComponent;
  let fixture: ComponentFixture<NpsSummaryPortfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NpsSummaryPortfolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NpsSummaryPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
