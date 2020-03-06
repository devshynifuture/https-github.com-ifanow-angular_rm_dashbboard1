import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsClientsComponent } from './leads-clients.component';

describe('LeadsClientsComponent', () => {
  let component: LeadsClientsComponent;
  let fixture: ComponentFixture<LeadsClientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadsClientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadsClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
