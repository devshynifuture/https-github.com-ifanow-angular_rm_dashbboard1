import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SipSchemeWiseComponent } from './sip-scheme-wise.component';

describe('SipSchemeWiseComponent', () => {
  let component: SipSchemeWiseComponent;
  let fixture: ComponentFixture<SipSchemeWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SipSchemeWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SipSchemeWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
