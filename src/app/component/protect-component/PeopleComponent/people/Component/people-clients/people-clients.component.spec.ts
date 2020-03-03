import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleClientsComponent } from './people-clients.component';

describe('PeopleClientsComponent', () => {
  let component: PeopleClientsComponent;
  let fixture: ComponentFixture<PeopleClientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeopleClientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
