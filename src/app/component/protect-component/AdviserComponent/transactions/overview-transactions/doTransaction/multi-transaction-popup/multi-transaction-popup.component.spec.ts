import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiTransactionPopupComponent } from './multi-transaction-popup.component';

describe('MultiTransactionPopupComponent', () => {
  let component: MultiTransactionPopupComponent;
  let fixture: ComponentFixture<MultiTransactionPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiTransactionPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiTransactionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
