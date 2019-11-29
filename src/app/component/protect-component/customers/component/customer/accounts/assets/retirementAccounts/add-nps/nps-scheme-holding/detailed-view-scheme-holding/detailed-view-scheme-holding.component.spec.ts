import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedViewSchemeHoldingComponent } from './detailed-view-scheme-holding.component';

describe('DetailedViewSchemeHoldingComponent', () => {
  let component: DetailedViewSchemeHoldingComponent;
  let fixture: ComponentFixture<DetailedViewSchemeHoldingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedViewSchemeHoldingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedViewSchemeHoldingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
