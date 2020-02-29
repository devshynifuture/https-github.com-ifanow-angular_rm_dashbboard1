import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmOpportunitiesComponent } from './crm-opportunities.component';

describe('CrmOpportunitiesComponent', () => {
  let component: CrmOpportunitiesComponent;
  let fixture: ComponentFixture<CrmOpportunitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrmOpportunitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmOpportunitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
