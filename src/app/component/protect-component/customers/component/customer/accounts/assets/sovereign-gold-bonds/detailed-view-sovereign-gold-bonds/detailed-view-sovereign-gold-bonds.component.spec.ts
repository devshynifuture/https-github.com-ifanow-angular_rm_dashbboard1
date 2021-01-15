import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedViewSovereignGoldBondsComponent } from './detailed-view-sovereign-gold-bonds.component';

describe('DetailedViewSovereignGoldBondsComponent', () => {
  let component: DetailedViewSovereignGoldBondsComponent;
  let fixture: ComponentFixture<DetailedViewSovereignGoldBondsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedViewSovereignGoldBondsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedViewSovereignGoldBondsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
