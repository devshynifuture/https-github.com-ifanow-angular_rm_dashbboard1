import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplacePostsAddComponent } from './marketplace-posts-add.component';

describe('MarketplacePostsAddComponent', () => {
  let component: MarketplacePostsAddComponent;
  let fixture: ComponentFixture<MarketplacePostsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketplacePostsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplacePostsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
