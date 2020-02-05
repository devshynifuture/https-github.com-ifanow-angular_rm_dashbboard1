import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchTransactionComponent } from './switch-transaction.component';

describe('SwitchTransactionComponent', () => {
  let component: SwitchTransactionComponent;
  let fixture: ComponentFixture<SwitchTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwitchTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
