import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceReviewRequestBulkComponent } from './marketplace-review-request-bulk.component';

describe('MarketplaceReviewRequestBulkComponent', () => {
  let component: MarketplaceReviewRequestBulkComponent;
  let fixture: ComponentFixture<MarketplaceReviewRequestBulkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketplaceReviewRequestBulkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceReviewRequestBulkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
