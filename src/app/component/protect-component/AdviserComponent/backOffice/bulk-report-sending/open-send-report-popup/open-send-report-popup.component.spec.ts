import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenSendReportPopupComponent } from './open-send-report-popup.component';

describe('OpenSendReportPopupComponent', () => {
  let component: OpenSendReportPopupComponent;
  let fixture: ComponentFixture<OpenSendReportPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenSendReportPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenSendReportPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
