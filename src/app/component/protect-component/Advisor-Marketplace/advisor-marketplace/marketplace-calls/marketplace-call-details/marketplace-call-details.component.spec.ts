import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceCallDetailsComponent } from './marketplace-call-details.component';

describe('MarketplaceCallDetailsComponent', () => {
  let component: MarketplaceCallDetailsComponent;
  let fixture: ComponentFixture<MarketplaceCallDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketplaceCallDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceCallDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
