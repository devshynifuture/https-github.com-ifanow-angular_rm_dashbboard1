import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceReviewReplyComponent } from './marketplace-review-reply.component';

describe('MarketplaceReviewReplyComponent', () => {
  let component: MarketplaceReviewReplyComponent;
  let fixture: ComponentFixture<MarketplaceReviewReplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketplaceReviewReplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceReviewReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
