import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StpTransactionComponent } from './stp-transaction.component';

describe('StpTransactionComponent', () => {
  let component: StpTransactionComponent;
  let fixture: ComponentFixture<StpTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StpTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StpTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
