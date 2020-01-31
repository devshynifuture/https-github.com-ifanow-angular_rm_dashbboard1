import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewTransactionsComponent } from './overview-transactions.component';

describe('OverviewTransactionsComponent', () => {
  let component: OverviewTransactionsComponent;
  let fixture: ComponentFixture<OverviewTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverviewTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
