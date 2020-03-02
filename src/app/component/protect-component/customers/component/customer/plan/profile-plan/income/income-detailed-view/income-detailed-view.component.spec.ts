import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeDetailedViewComponent } from './income-detailed-view.component';

describe('IncomeDetailedViewComponent', () => {
  let component: IncomeDetailedViewComponent;
  let fixture: ComponentFixture<IncomeDetailedViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomeDetailedViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeDetailedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
