import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockScripComponent } from './stock-scrip.component';

describe('StockScripComponent', () => {
  let component: StockScripComponent;
  let fixture: ComponentFixture<StockScripComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockScripComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockScripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
