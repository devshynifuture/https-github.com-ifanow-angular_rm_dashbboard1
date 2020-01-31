import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdviceMutualFundComponent } from './advice-mutual-fund.component';

describe('AdviceMutualFundComponent', () => {
  let component: AdviceMutualFundComponent;
  let fixture: ComponentFixture<AdviceMutualFundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdviceMutualFundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdviceMutualFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
