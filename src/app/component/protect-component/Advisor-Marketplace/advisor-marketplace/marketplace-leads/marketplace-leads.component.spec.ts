import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceLeadsComponent } from './marketplace-leads.component';

describe('MarketplaceLeadsComponent', () => {
  let component: MarketplaceLeadsComponent;
  let fixture: ComponentFixture<MarketplaceLeadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketplaceLeadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
