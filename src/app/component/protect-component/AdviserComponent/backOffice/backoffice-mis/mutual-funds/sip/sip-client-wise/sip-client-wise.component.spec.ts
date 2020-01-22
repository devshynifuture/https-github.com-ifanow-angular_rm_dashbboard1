import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SipClientWiseComponent } from './sip-client-wise.component';

describe('SipClientWiseComponent', () => {
  let component: SipClientWiseComponent;
  let fixture: ComponentFixture<SipClientWiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SipClientWiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SipClientWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
