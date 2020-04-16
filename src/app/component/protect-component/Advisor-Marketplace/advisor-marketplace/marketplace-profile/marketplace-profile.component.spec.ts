import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceProfileComponent } from './marketplace-profile.component';

describe('MarketplaceProfileComponent', () => {
  let component: MarketplaceProfileComponent;
  let fixture: ComponentFixture<MarketplaceProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketplaceProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
