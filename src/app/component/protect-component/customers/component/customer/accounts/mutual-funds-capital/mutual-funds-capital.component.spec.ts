import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MutualFundsCapitalComponent } from './mutual-funds-capital.component';

describe('MutualFundsCapitalComponent', () => {
  let component: MutualFundsCapitalComponent;
  let fixture: ComponentFixture<MutualFundsCapitalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MutualFundsCapitalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MutualFundsCapitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
