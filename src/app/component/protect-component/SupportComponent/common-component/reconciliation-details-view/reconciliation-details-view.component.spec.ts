import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconciliationDetailsViewComponent } from './reconciliation-details-view.component';

describe('ReconciliationDetailsViewComponent', () => {
  let component: ReconciliationDetailsViewComponent;
  let fixture: ComponentFixture<ReconciliationDetailsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReconciliationDetailsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconciliationDetailsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
