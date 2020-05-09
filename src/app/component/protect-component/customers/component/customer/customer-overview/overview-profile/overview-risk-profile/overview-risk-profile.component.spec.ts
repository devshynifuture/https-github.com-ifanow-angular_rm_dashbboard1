import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewRiskProfileComponent } from './overview-risk-profile.component';

describe('OverviewRiskProfileComponent', () => {
  let component: OverviewRiskProfileComponent;
  let fixture: ComponentFixture<OverviewRiskProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverviewRiskProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewRiskProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
