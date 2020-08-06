import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SipCleanupComponent } from './sip-cleanup.component';

describe('SipCleanupComponent', () => {
  let component: SipCleanupComponent;
  let fixture: ComponentFixture<SipCleanupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SipCleanupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SipCleanupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
