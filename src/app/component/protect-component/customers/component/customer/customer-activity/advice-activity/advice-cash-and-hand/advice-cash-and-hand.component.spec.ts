import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdviceCashAndHandComponent } from './advice-cash-and-hand.component';

describe('AdviceCashAndHandComponent', () => {
  let component: AdviceCashAndHandComponent;
  let fixture: ComponentFixture<AdviceCashAndHandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdviceCashAndHandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdviceCashAndHandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
