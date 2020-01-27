import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportAumReconciliationComponent } from './support-aum-reconciliation.component';

describe('SupportAumReconciliationComponent', () => {
  let component: SupportAumReconciliationComponent;
  let fixture: ComponentFixture<SupportAumReconciliationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportAumReconciliationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportAumReconciliationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
