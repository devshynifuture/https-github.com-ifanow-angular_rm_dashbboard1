import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBankAccMobComponent } from './add-bank-acc-mob.component';

describe('AddBankAccMobComponent', () => {
  let component: AddBankAccMobComponent;
  let fixture: ComponentFixture<AddBankAccMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBankAccMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBankAccMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
