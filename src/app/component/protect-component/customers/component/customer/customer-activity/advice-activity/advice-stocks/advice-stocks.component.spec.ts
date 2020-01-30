import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdviceStocksComponent } from './advice-stocks.component';

describe('AdviceStocksComponent', () => {
  let component: AdviceStocksComponent;
  let fixture: ComponentFixture<AdviceStocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdviceStocksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdviceStocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
