import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportReceivablesComponent } from './report-receivables.component';

describe('ReportReceivablesComponent', () => {
  let component: ReportReceivablesComponent;
  let fixture: ComponentFixture<ReportReceivablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportReceivablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportReceivablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
