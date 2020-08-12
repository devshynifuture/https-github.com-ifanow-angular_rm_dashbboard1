import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaiseSupportTicketComponent } from './raise-support-ticket.component';

describe('RaiseSupportTicketComponent', () => {
  let component: RaiseSupportTicketComponent;
  let fixture: ComponentFixture<RaiseSupportTicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaiseSupportTicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaiseSupportTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
