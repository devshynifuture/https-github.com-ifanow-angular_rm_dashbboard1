import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuringDepositComponent } from './recuring-deposit.component';

describe('RecuringDepositComponent', () => {
  let component: RecuringDepositComponent;
  let fixture: ComponentFixture<RecuringDepositComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecuringDepositComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecuringDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
