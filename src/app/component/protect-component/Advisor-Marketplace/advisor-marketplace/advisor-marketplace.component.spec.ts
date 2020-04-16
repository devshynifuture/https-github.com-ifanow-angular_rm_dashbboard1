import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisorMarketplaceComponent } from './advisor-marketplace.component';

describe('AdvisorMarketplaceComponent', () => {
  let component: AdvisorMarketplaceComponent;
  let fixture: ComponentFixture<AdvisorMarketplaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvisorMarketplaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvisorMarketplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
