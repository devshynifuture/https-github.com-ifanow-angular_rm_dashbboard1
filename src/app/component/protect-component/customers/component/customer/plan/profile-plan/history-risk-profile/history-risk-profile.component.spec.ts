import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryRiskProfileComponent } from './history-risk-profile.component';

describe('HistoryRiskProfileComponent', () => {
  let component: HistoryRiskProfileComponent;
  let fixture: ComponentFixture<HistoryRiskProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryRiskProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryRiskProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
