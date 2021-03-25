import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MfElssReportComponent } from './mf-elss-report.component';

describe('MfElssReportComponent', () => {
  let component: MfElssReportComponent;
  let fixture: ComponentFixture<MfElssReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MfElssReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MfElssReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
