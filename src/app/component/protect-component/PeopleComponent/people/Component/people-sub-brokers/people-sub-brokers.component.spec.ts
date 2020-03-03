import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleSubBrokersComponent } from './people-sub-brokers.component';

describe('PeopleSubBrokersComponent', () => {
  let component: PeopleSubBrokersComponent;
  let fixture: ComponentFixture<PeopleSubBrokersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeopleSubBrokersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleSubBrokersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
