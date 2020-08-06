import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockHoldingDetailsComponent } from './stock-holding-details.component';

describe('StockHoldingDetailsComponent', () => {
  let component: StockHoldingDetailsComponent;
  let fixture: ComponentFixture<StockHoldingDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockHoldingDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockHoldingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
