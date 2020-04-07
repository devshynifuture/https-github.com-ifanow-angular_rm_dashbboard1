import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionMobileViewComponent } from './transaction-mobile-view.component';

describe('TransactionMobileViewComponent', () => {
  let component: TransactionMobileViewComponent;
  let fixture: ComponentFixture<TransactionMobileViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionMobileViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionMobileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
