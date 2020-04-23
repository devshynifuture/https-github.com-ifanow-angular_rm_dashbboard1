import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceProfileEditComponent } from './marketplace-profile-edit.component';

describe('MarketplaceProfileEditComponent', () => {
  let component: MarketplaceProfileEditComponent;
  let fixture: ComponentFixture<MarketplaceProfileEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketplaceProfileEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceProfileEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
