import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplacePostsComponent } from './marketplace-posts.component';

describe('MarketplacePostsComponent', () => {
  let component: MarketplacePostsComponent;
  let fixture: ComponentFixture<MarketplacePostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketplacePostsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplacePostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
