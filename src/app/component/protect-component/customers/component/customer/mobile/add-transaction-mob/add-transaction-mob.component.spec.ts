import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTransactionMobComponent } from './add-transaction-mob.component';

describe('AddTransactionMobComponent', () => {
  let component: AddTransactionMobComponent;
  let fixture: ComponentFixture<AddTransactionMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTransactionMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTransactionMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
