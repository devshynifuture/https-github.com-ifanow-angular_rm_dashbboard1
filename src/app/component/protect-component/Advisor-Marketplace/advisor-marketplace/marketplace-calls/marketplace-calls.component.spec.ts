import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceCallsComponent } from './marketplace-calls.component';

describe('MarketplaceCallsComponent', () => {
  let component: MarketplaceCallsComponent;
  let fixture: ComponentFixture<MarketplaceCallsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketplaceCallsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceCallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
