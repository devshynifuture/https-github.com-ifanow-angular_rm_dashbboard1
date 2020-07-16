import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCashInHandMobComponent } from './add-cash-in-hand-mob.component';

describe('AddCashInHandMobComponent', () => {
  let component: AddCashInHandMobComponent;
  let fixture: ComponentFixture<AddCashInHandMobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCashInHandMobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCashInHandMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
