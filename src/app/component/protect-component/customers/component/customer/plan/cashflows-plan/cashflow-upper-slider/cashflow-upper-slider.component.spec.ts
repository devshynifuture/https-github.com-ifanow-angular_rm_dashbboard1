import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashflowUpperSliderComponent } from './cashflow-upper-slider.component';

describe('CashflowUpperSliderComponent', () => {
  let component: CashflowUpperSliderComponent;
  let fixture: ComponentFixture<CashflowUpperSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashflowUpperSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashflowUpperSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
