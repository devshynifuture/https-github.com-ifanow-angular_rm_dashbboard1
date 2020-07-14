import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedViewExpensesComponent } from './detailed-view-expenses.component';

describe('DetailedViewExpensesComponent', () => {
  let component: DetailedViewExpensesComponent;
  let fixture: ComponentFixture<DetailedViewExpensesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedViewExpensesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedViewExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
