import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SipAmcWiseComponent } from './sip-amc-wise.component';

describe('SipAmcWiseComponent', () => {
  let component: SipAmcWiseComponent;
  let fixture: ComponentFixture<SipAmcWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SipAmcWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SipAmcWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
