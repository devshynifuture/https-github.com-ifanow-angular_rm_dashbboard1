import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MutualFundGoalLinkageComponent } from './mutual-fund-goal-linkage.component';

describe('MutualFundGoalLinkageComponent', () => {
  let component: MutualFundGoalLinkageComponent;
  let fixture: ComponentFixture<MutualFundGoalLinkageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MutualFundGoalLinkageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MutualFundGoalLinkageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
