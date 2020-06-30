import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardGuideDialogComponent } from './dashboard-guide-dialog.component';

describe('DashboardGuideDialogComponent', () => {
  let component: DashboardGuideDialogComponent;
  let fixture: ComponentFixture<DashboardGuideDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardGuideDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardGuideDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
