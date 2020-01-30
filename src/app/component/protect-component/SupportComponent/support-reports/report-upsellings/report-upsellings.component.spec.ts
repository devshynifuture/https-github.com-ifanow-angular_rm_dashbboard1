import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportUpsellingsComponent } from './report-upsellings.component';

describe('ReportUpsellingsComponent', () => {
  let component: ReportUpsellingsComponent;
  let fixture: ComponentFixture<ReportUpsellingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportUpsellingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportUpsellingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
