import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GmailRedirectComponent} from './gmail-redirect.component';

describe('GmailRedirectComponent', () => {
  let component: GmailRedirectComponent;
  let fixture: ComponentFixture<GmailRedirectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GmailRedirectComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GmailRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
