import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SipDetailsComponent } from './sip-details.component';

describe('SipDetailsComponent', () => {
  let component: SipDetailsComponent;
  let fixture: ComponentFixture<SipDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SipDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SipDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
