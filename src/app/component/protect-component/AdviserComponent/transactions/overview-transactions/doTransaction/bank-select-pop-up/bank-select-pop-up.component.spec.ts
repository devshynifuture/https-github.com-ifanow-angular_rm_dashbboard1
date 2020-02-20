import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankSelectPopUpComponent } from './bank-select-pop-up.component';

describe('BankSelectPopUpComponent', () => {
  let component: BankSelectPopUpComponent;
  let fixture: ComponentFixture<BankSelectPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankSelectPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankSelectPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
