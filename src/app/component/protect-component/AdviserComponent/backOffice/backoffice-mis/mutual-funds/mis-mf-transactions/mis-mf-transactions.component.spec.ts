import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisMfTransactionsComponent } from './mis-mf-transactions.component';

describe('MisMfTransactionsComponent', () => {
  let component: MisMfTransactionsComponent;
  let fixture: ComponentFixture<MisMfTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisMfTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisMfTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
