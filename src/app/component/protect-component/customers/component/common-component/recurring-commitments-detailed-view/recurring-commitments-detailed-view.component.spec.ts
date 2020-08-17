import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringCommitmentsDetailedViewComponent } from './recurring-commitments-detailed-view.component';

describe('RecurringCommitmentsDetailedViewComponent', () => {
  let component: RecurringCommitmentsDetailedViewComponent;
  let fixture: ComponentFixture<RecurringCommitmentsDetailedViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecurringCommitmentsDetailedViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecurringCommitmentsDetailedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
