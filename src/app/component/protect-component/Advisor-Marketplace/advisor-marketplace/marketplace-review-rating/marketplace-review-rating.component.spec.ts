import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceReviewRatingComponent } from './marketplace-review-rating.component';

describe('MarketplaceReviewRatingComponent', () => {
  let component: MarketplaceReviewRatingComponent;
  let fixture: ComponentFixture<MarketplaceReviewRatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketplaceReviewRatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceReviewRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
