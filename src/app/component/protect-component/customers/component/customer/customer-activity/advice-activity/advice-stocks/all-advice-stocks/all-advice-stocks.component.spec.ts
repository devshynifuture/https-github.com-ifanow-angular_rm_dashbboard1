import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAdviceStocksComponent } from './all-advice-stocks.component';

describe('AllAdviceStocksComponent', () => {
  let component: AllAdviceStocksComponent;
  let fixture: ComponentFixture<AllAdviceStocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllAdviceStocksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllAdviceStocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
