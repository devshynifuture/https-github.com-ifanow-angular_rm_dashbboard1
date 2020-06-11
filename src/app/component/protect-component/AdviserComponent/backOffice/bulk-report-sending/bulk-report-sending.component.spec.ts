import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkReportSendingComponent } from './bulk-report-sending.component';

describe('BulkReportSendingComponent', () => {
  let component: BulkReportSendingComponent;
  let fixture: ComponentFixture<BulkReportSendingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkReportSendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkReportSendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
