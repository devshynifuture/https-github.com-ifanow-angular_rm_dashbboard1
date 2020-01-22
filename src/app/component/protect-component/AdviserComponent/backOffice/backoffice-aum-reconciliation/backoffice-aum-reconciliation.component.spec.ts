import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackofficeAumReconciliationComponent } from './backoffice-aum-reconciliation.component';

describe('BackofficeAumReconciliationComponent', () => {
  let component: BackofficeAumReconciliationComponent;
  let fixture: ComponentFixture<BackofficeAumReconciliationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackofficeAumReconciliationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackofficeAumReconciliationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
