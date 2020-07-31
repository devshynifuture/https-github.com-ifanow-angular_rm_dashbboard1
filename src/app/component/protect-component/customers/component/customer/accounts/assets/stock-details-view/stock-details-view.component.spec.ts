import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockDetailsViewComponent } from './stock-details-view.component';

describe('StockDetailsViewComponent', () => {
  let component: StockDetailsViewComponent;
  let fixture: ComponentFixture<StockDetailsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockDetailsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockDetailsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
