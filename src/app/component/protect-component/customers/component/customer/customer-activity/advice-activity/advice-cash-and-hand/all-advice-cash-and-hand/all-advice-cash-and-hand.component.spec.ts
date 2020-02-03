import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllAdviceCashAndHandComponent } from './all-advice-cash-and-hand.component';

describe('AllAdviceCashAndHandComponent', () => {
  let component: AllAdviceCashAndHandComponent;
  let fixture: ComponentFixture<AllAdviceCashAndHandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllAdviceCashAndHandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllAdviceCashAndHandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
