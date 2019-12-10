import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockScripLevelHoldingComponent } from './stock-scrip-level-holding.component';

describe('StockScripLevelHoldingComponent', () => {
  let component: StockScripLevelHoldingComponent;
  let fixture: ComponentFixture<StockScripLevelHoldingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockScripLevelHoldingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockScripLevelHoldingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
