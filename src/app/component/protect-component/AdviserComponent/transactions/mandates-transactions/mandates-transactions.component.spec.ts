import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MandatesTransactionsComponent } from './mandates-transactions.component';

describe('MandatesTransactionsComponent', () => {
  let component: MandatesTransactionsComponent;
  let fixture: ComponentFixture<MandatesTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MandatesTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MandatesTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
